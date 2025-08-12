import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RateLimit,
  RateLimitType,
  WindowType,
} from '../database/entities/rate-limit.entity';
import { User } from '../database/entities/user.entity';
import { SecurityUtil } from '../utils';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
  rateLimitType: RateLimitType;
}

export interface DocumentGenerationRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
  planType: string;
}

@Injectable()
export class RateLimitingService {
  private readonly logger = new Logger(RateLimitingService.name);

  constructor(
    @InjectRepository(RateLimit)
    private readonly rateLimitRepository: Repository<RateLimit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private hashIp(ip: string): string {
    return SecurityUtil.hashSensitiveData(ip);
  }

  /**
   * Check rate limit for document generation (monthly limits)
   */
  async checkDocumentGenerationRateLimit(
    ip: string,
    userId?: string,
  ): Promise<DocumentGenerationRateLimitResult> {
    try {
      const ipHash = this.hashIp(ip);
      const now = new Date();

      // Get limits based on user status and plan
      let limit: number;
      let planType = 'anonymous';

      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });

        if (user) {
          planType = user.planType;
          const limits = this.configService.get('rateLimit.documentGeneration');

          if (user.planType === 'team') {
            limit = -1; // Unlimited
          } else {
            limit = limits[user.planType] || limits.free;
          }
        } else {
          limit = this.configService.get(
            'rateLimit.documentGeneration.anonymous',
          );
        }
      } else {
        limit = this.configService.get(
          'rateLimit.documentGeneration.anonymous',
        );
      }

      // Check if it's a new month for monthly reset
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Find existing rate limit record
      let rateLimit = await this.rateLimitRepository.findOne({
        where: {
          ipHash,
          rateLimitType: RateLimitType.DOCUMENT_GENERATION,
        },
      });

      if (!rateLimit) {
        // Create new rate limit record
        rateLimit = this.rateLimitRepository.create({
          ipHash,
          rateLimitType: RateLimitType.DOCUMENT_GENERATION,
          windowType: WindowType.MONTHLY,
          windowDurationMs: 2592000000, // 30 days
          usageCount: 1,
          lastResetDate: monthStart,
        });
      } else {
        // Check if it's a new month
        if (rateLimit.lastResetDate < monthStart) {
          rateLimit.usageCount = 1;
          rateLimit.lastResetDate = monthStart;
        } else {
          rateLimit.usageCount += 1;
        }
      }

      await this.rateLimitRepository.save(rateLimit);

      const remaining =
        limit === -1 ? 999 : Math.max(0, limit - rateLimit.usageCount);
      const allowed = limit === -1 || rateLimit.usageCount <= limit;

      this.logger.debug(
        `Document generation rate limit check for ${planType} user: ${rateLimit.usageCount}/${limit}, allowed: ${allowed}`,
      );

      return {
        allowed,
        remaining,
        resetTime: nextMonth,
        limit,
        planType,
      };
    } catch (error) {
      this.logger.error(
        'Error checking document generation rate limit:',
        error,
      );
      // In case of error, allow the request (fail open)
      return {
        allowed: true,
        remaining: 999,
        resetTime: new Date(),
        limit: 999,
        planType: 'unknown',
      };
    }
  }

  /**
   * Check rate limit for login attempts (per minute)
   */
  async checkLoginAttemptRateLimit(ip: string): Promise<RateLimitResult> {
    try {
      const ipHash = this.hashIp(ip);
      const now = new Date();

      const config = this.configService.get('rateLimit.loginAttempt');
      const limit = config.maxAttempts;
      const windowMs = config.windowMs;
      const windowStart = new Date(now.getTime() - windowMs);

      // Find existing rate limit record
      let rateLimit = await this.rateLimitRepository.findOne({
        where: {
          ipHash,
          rateLimitType: RateLimitType.LOGIN_ATTEMPT,
        },
      });

      if (!rateLimit) {
        // Create new rate limit record
        rateLimit = this.rateLimitRepository.create({
          ipHash,
          rateLimitType: RateLimitType.LOGIN_ATTEMPT,
          windowType: WindowType.PER_MINUTE,
          windowDurationMs: windowMs,
          usageCount: 1,
          lastResetDate: now,
        });
      } else {
        // Check if window has reset
        if (rateLimit.lastResetDate < windowStart) {
          rateLimit.usageCount = 1;
          rateLimit.lastResetDate = now;
        } else {
          rateLimit.usageCount += 1;
        }
      }

      await this.rateLimitRepository.save(rateLimit);

      const remaining = Math.max(0, limit - rateLimit.usageCount);
      const allowed = rateLimit.usageCount <= limit;
      const resetTime = new Date(rateLimit.lastResetDate.getTime() + windowMs);

      this.logger.debug(
        `Login attempt rate limit check for IP ${ipHash}: ${rateLimit.usageCount}/${limit}, allowed: ${allowed}`,
      );

      return {
        allowed,
        remaining,
        resetTime,
        limit,
        rateLimitType: RateLimitType.LOGIN_ATTEMPT,
      };
    } catch (error) {
      this.logger.error('Error checking login attempt rate limit:', error);
      // In case of error, allow the request (fail open)
      return {
        allowed: true,
        remaining: 999,
        resetTime: new Date(),
        limit: 999,
        rateLimitType: RateLimitType.LOGIN_ATTEMPT,
      };
    }
  }

  /**
   * Check general API rate limit (per time window)
   */
  async checkApiRateLimit(ip: string): Promise<RateLimitResult> {
    try {
      const ipHash = this.hashIp(ip);
      const now = new Date();

      const config = this.configService.get('rateLimit.api');
      const limit = config.maxRequests;
      const windowMs = config.windowMs;
      const windowStart = new Date(now.getTime() - windowMs);

      // Find existing rate limit record
      let rateLimit = await this.rateLimitRepository.findOne({
        where: {
          ipHash,
          rateLimitType: RateLimitType.API_REQUEST,
        },
      });

      if (!rateLimit) {
        // Create new rate limit record
        rateLimit = this.rateLimitRepository.create({
          ipHash,
          rateLimitType: RateLimitType.API_REQUEST,
          windowType: WindowType.PER_HOUR, // Default to per hour for API
          windowDurationMs: windowMs,
          usageCount: 1,
          lastResetDate: now,
        });
      } else {
        // Check if window has reset
        if (rateLimit.lastResetDate < windowStart) {
          rateLimit.usageCount = 1;
          rateLimit.lastResetDate = now;
        } else {
          rateLimit.usageCount += 1;
        }
      }

      await this.rateLimitRepository.save(rateLimit);

      const remaining = Math.max(0, limit - rateLimit.usageCount);
      const allowed = rateLimit.usageCount <= limit;
      const resetTime = new Date(rateLimit.lastResetDate.getTime() + windowMs);

      this.logger.debug(
        `API rate limit check for IP ${ipHash}: ${rateLimit.usageCount}/${limit}, allowed: ${allowed}`,
      );

      return {
        allowed,
        remaining,
        resetTime,
        limit,
        rateLimitType: RateLimitType.API_REQUEST,
      };
    } catch (error) {
      this.logger.error('Error checking API rate limit:', error);
      // In case of error, allow the request (fail open)
      return {
        allowed: true,
        remaining: 999,
        resetTime: new Date(),
        limit: 999,
        rateLimitType: RateLimitType.API_REQUEST,
      };
    }
  }

  /**
   * Increment user monthly usage count
   */
  async incrementUserUsage(userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (user) {
        user.monthlyUsageCount += 1;
        await this.userRepository.save(user);
      }
    } catch (error) {
      this.logger.error('Error incrementing user usage:', error);
    }
  }

  /**
   * Get comprehensive rate limit status for all types
   */
  async getRateLimitStatus(
    ip: string,
    userId?: string,
  ): Promise<{
    documentGeneration: DocumentGenerationRateLimitResult;
    loginAttempt?: RateLimitResult;
    api?: RateLimitResult;
  }> {
    const documentGeneration = await this.checkDocumentGenerationRateLimit(
      ip,
      userId,
    );
    const loginAttempt = await this.checkLoginAttemptRateLimit(ip);
    const api = await this.checkApiRateLimit(ip);

    return {
      documentGeneration,
      loginAttempt,
      api,
    };
  }
}
