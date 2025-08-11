import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimit } from '../database/entities/rate-limit.entity';
import { User } from '../database/entities/user.entity';
import * as crypto from 'crypto';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
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
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  async checkRateLimit(ip: string, userId?: string): Promise<RateLimitResult> {
    try {
      const ipHash = this.hashIp(ip);

      // Get rate limit configuration
      const config = {
        anonymous:
          this.configService.get('rateLimit.ipRateLimitAnonymous') || 3,
        authenticated:
          this.configService.get('rateLimit.ipRateLimitAuthenticated') || 10,
        windowMs: this.configService.get('rateLimit.windowMs') || 900000, // 15 minutes
      };

      // Determine limit based on authentication status
      const limit = userId ? config.authenticated : config.anonymous;
      const windowMs = config.windowMs;

      // Find existing rate limit record
      let rateLimit = await this.rateLimitRepository.findOne({
        where: { ipHash },
      });

      const now = new Date();
      const windowStart = new Date(now.getTime() - windowMs);

      if (!rateLimit) {
        // Create new rate limit record
        rateLimit = this.rateLimitRepository.create({
          ipHash,
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
        `Rate limit check for IP ${ipHash}: ${rateLimit.usageCount}/${limit}, allowed: ${allowed}`,
      );

      return {
        allowed,
        remaining,
        resetTime,
        limit,
      };
    } catch (error) {
      this.logger.error('Error checking rate limit:', error);
      // In case of error, allow the request (fail open)
      return {
        allowed: true,
        remaining: 999,
        resetTime: new Date(),
        limit: 999,
      };
    }
  }

  async checkUserUsageLimit(userId: string): Promise<RateLimitResult> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if it's a new month
      const now = new Date();
      const lastReset = new Date(user.usageResetDate);
      const isNewMonth =
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear();

      if (isNewMonth) {
        user.monthlyUsageCount = 0;
        user.usageResetDate = now;
        await this.userRepository.save(user);
      }

      // Get limits based on plan
      const limits = {
        free: 10,
        pro: 100,
        team: -1, // Unlimited
      };

      const limit = limits[user.planType] || limits.free;
      const remaining =
        limit === -1 ? 999 : Math.max(0, limit - user.monthlyUsageCount);
      const allowed = limit === -1 || user.monthlyUsageCount < limit;

      // Calculate reset time (next month)
      const resetTime = new Date(lastReset);
      resetTime.setMonth(resetTime.getMonth() + 1);

      this.logger.debug(
        `User usage check for ${userId}: ${user.monthlyUsageCount}/${limit}, allowed: ${allowed}`,
      );

      return {
        allowed,
        remaining,
        resetTime,
        limit,
      };
    } catch (error) {
      this.logger.error('Error checking user usage limit:', error);
      // In case of error, allow the request (fail open)
      return {
        allowed: true,
        remaining: 999,
        resetTime: new Date(),
        limit: 999,
      };
    }
  }

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

  async getRateLimitStatus(
    ip: string,
    userId?: string,
  ): Promise<{
    ip: RateLimitResult;
    user?: RateLimitResult;
  }> {
    const ipStatus = await this.checkRateLimit(ip, userId);
    let userStatus: RateLimitResult | undefined;

    if (userId) {
      userStatus = await this.checkUserUsageLimit(userId);
    }

    return {
      ip: ipStatus,
      user: userStatus,
    };
  }
}
