import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { RateLimitingService } from '../../rate-limiting/rate-limiting.service';

@Injectable()
export class ComprehensiveAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly rateLimitingService: RateLimitingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);

      // Get user from database to ensure they still exist
      const user = await this.authService.getUserById(payload.sub);

      // Check rate limiting for authenticated users
      const rateLimitResult = await this.rateLimitingService.checkApiRateLimit(
        request.ip,
      );

      if (!rateLimitResult.allowed) {
        throw new UnauthorizedException('Rate limit exceeded');
      }

      // Check user usage limits for document generation
      const userUsageResult =
        await this.rateLimitingService.checkDocumentGenerationRateLimit(
          request.ip,
          user.id,
        );

      if (!userUsageResult.allowed) {
        throw new UnauthorizedException('Monthly usage limit exceeded');
      }

      // Attach user and rate limit info to request
      request['user'] = user;
      request['rateLimit'] = rateLimitResult;
      request['userUsage'] = userUsageResult;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
