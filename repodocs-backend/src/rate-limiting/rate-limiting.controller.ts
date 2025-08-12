import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RateLimitingService } from './rate-limiting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/auth.service';

@Controller('rate-limit')
export class RateLimitingController {
  constructor(private readonly rateLimitingService: RateLimitingService) {}

  @Get('status')
  async getRateLimitStatus(@Req() req: Request) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    return this.rateLimitingService.getRateLimitStatus(clientIp);
  }

  @Get('status/authenticated')
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedRateLimitStatus(
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    return this.rateLimitingService.getRateLimitStatus(clientIp, user.sub);
  }

  @Get('document-generation')
  async getDocumentGenerationRateLimitInfo() {
    // Return document generation rate limit configuration information
    return {
      anonymous: {
        monthlyLimit: 3,
        description: 'IP-based monthly limit for anonymous users',
      },
      free: {
        monthlyLimit: 10,
        description: 'Monthly limit for free plan users',
      },
      pro: {
        monthlyLimit: 100,
        description: 'Monthly limit for pro plan users',
      },
      team: {
        monthlyLimit: 'Unlimited',
        description: 'Unlimited monthly usage for team plan users',
      },
    };
  }

  @Get('login-attempts')
  async getLoginAttemptRateLimitInfo() {
    // Return login attempt rate limit configuration information
    return {
      maxAttempts: 5,
      window: '1 minute',
      description: 'Rate limiting for login attempts per IP address',
    };
  }

  @Get('api')
  async getApiRateLimitInfo() {
    // Return API rate limit configuration information
    return {
      maxRequests: 100,
      window: '15 minutes',
      description: 'General API rate limiting for all endpoints',
    };
  }
}
