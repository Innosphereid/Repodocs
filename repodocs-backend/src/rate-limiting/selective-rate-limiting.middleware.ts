import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitingService } from './rate-limiting.service';

@Injectable()
export class SelectiveRateLimitingMiddleware implements NestMiddleware {
  constructor(private readonly rateLimitingService: RateLimitingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const path = req.path;
      const method = req.method;

      // Extract user ID from JWT token if present
      let userId: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          // Simple JWT decode to get user ID (in production, use proper JWT service)
          const token = authHeader.substring(7);
          const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString(),
          );
          userId = payload.sub;
        } catch (error) {
          // Invalid token, treat as anonymous
        }
      }

      // Apply rate limiting based on endpoint type
      if (this.isDocumentGenerationEndpoint(path, method)) {
        await this.checkDocumentGenerationRateLimit(clientIp, userId, res);
      } else if (this.isLoginEndpoint(path, method)) {
        await this.checkLoginAttemptRateLimit(clientIp, res);
      } else if (this.isApiEndpoint(path, method)) {
        await this.checkApiRateLimit(clientIp, res);
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Log error but allow request to continue (fail open)
      console.error('Selective rate limiting middleware error:', error);
      next();
    }
  }

  private isDocumentGenerationEndpoint(path: string, method: string): boolean {
    return (
      (path.startsWith('/repository-analysis') && method === 'POST') ||
      (path.startsWith('/generate-documentation') && method === 'POST')
    );
  }

  private isLoginEndpoint(path: string, method: string): boolean {
    return (
      (path === '/auth/login' && method === 'POST') ||
      (path === '/auth/local' && method === 'POST') ||
      (path === '/auth/github' && method === 'POST')
    );
  }

  private isApiEndpoint(path: string, method: string): boolean {
    // Exclude health checks and static files
    const excludedPaths = [
      '/health',
      '/metrics',
      '/favicon.ico',
      '/robots.txt',
    ];

    return !excludedPaths.some(excluded => path.startsWith(excluded));
  }

  private async checkDocumentGenerationRateLimit(
    ip: string,
    userId: string | undefined,
    res: Response,
  ): Promise<void> {
    const result =
      await this.rateLimitingService.checkDocumentGenerationRateLimit(
        ip,
        userId,
      );

    if (!result.allowed) {
      throw new HttpException(
        {
          message: 'Monthly document generation limit exceeded',
          error: 'Too Many Requests',
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          remaining: result.remaining,
          resetTime: result.resetTime,
          planType: result.planType,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add rate limit headers
    res.setHeader('X-DocGenRateLimit-Limit', result.limit);
    res.setHeader('X-DocGenRateLimit-Remaining', result.remaining);
    res.setHeader('X-DocGenRateLimit-Reset', result.resetTime.getTime());
    res.setHeader('X-DocGenRateLimit-PlanType', result.planType);
  }

  private async checkLoginAttemptRateLimit(
    ip: string,
    res: Response,
  ): Promise<void> {
    const result =
      await this.rateLimitingService.checkLoginAttemptRateLimit(ip);

    if (!result.allowed) {
      throw new HttpException(
        {
          message: 'Too many login attempts. Please try again later.',
          error: 'Too Many Requests',
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          remaining: result.remaining,
          resetTime: result.resetTime,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add rate limit headers
    res.setHeader('X-LoginRateLimit-Limit', result.limit);
    res.setHeader('X-LoginRateLimit-Remaining', result.remaining);
    res.setHeader('X-LoginRateLimit-Reset', result.resetTime.getTime());
  }

  private async checkApiRateLimit(ip: string, res: Response): Promise<void> {
    const result = await this.rateLimitingService.checkApiRateLimit(ip);

    if (!result.allowed) {
      throw new HttpException(
        {
          message: 'API rate limit exceeded',
          error: 'Too Many Requests',
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          remaining: result.remaining,
          resetTime: result.resetTime,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add rate limit headers
    res.setHeader('X-ApiRateLimit-Limit', result.limit);
    res.setHeader('X-ApiRateLimit-Remaining', result.remaining);
    res.setHeader('X-ApiRateLimit-Reset', result.resetTime.getTime());
  }
}
