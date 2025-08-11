import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitingService } from './rate-limiting.service';

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  constructor(private readonly rateLimitingService: RateLimitingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

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

      // Check rate limits
      const rateLimitStatus = await this.rateLimitingService.getRateLimitStatus(
        clientIp,
        userId,
      );

      if (!rateLimitStatus.ip.allowed) {
        throw new HttpException(
          {
            message: 'Rate limit exceeded for IP address',
            error: 'Too Many Requests',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            remaining: rateLimitStatus.ip.remaining,
            resetTime: rateLimitStatus.ip.resetTime,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (userId && rateLimitStatus.user && !rateLimitStatus.user.allowed) {
        throw new HttpException(
          {
            message: 'Monthly usage limit exceeded',
            error: 'Too Many Requests',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            remaining: rateLimitStatus.user.remaining,
            resetTime: rateLimitStatus.user.resetTime,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Add rate limit headers to response
      res.setHeader('X-RateLimit-Limit', rateLimitStatus.ip.limit);
      res.setHeader('X-RateLimit-Remaining', rateLimitStatus.ip.remaining);
      res.setHeader(
        'X-RateLimit-Reset',
        rateLimitStatus.ip.resetTime.getTime(),
      );

      if (userId && rateLimitStatus.user) {
        res.setHeader('X-UserRateLimit-Limit', rateLimitStatus.user.limit);
        res.setHeader(
          'X-UserRateLimit-Remaining',
          rateLimitStatus.user.remaining,
        );
        res.setHeader(
          'X-UserRateLimit-Reset',
          rateLimitStatus.user.resetTime.getTime(),
        );
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Log error but allow request to continue (fail open)
      console.error('Rate limiting middleware error:', error);
      next();
    }
  }
}
