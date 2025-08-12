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

      // Check rate limits using new service structure
      const rateLimitStatus = await this.rateLimitingService.getRateLimitStatus(
        clientIp,
        userId,
      );

      // Check document generation rate limit
      if (!rateLimitStatus.documentGeneration.allowed) {
        throw new HttpException(
          {
            message: 'Monthly document generation limit exceeded',
            error: 'Too Many Requests',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            remaining: rateLimitStatus.documentGeneration.remaining,
            resetTime: rateLimitStatus.documentGeneration.resetTime,
            planType: rateLimitStatus.documentGeneration.planType,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Check API rate limit
      if (rateLimitStatus.api && !rateLimitStatus.api.allowed) {
        throw new HttpException(
          {
            message: 'API rate limit exceeded',
            error: 'Too Many Requests',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            remaining: rateLimitStatus.api.remaining,
            resetTime: rateLimitStatus.api.resetTime,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Add rate limit headers to response
      res.setHeader(
        'X-DocGenRateLimit-Limit',
        rateLimitStatus.documentGeneration.limit,
      );
      res.setHeader(
        'X-DocGenRateLimit-Remaining',
        rateLimitStatus.documentGeneration.remaining,
      );
      res.setHeader(
        'X-DocGenRateLimit-Reset',
        rateLimitStatus.documentGeneration.resetTime.getTime(),
      );
      res.setHeader(
        'X-DocGenRateLimit-PlanType',
        rateLimitStatus.documentGeneration.planType,
      );

      if (rateLimitStatus.api) {
        res.setHeader('X-ApiRateLimit-Limit', rateLimitStatus.api.limit);
        res.setHeader(
          'X-ApiRateLimit-Remaining',
          rateLimitStatus.api.remaining,
        );
        res.setHeader(
          'X-ApiRateLimit-Reset',
          rateLimitStatus.api.resetTime.getTime(),
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
