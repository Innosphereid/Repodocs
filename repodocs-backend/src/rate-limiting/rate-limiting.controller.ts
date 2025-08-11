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

  @Get('limits')
  async getRateLimitInfo() {
    // Return rate limit configuration information
    return {
      anonymous: {
        limit: 3,
        window: '15 minutes',
        description: 'IP-based rate limiting for anonymous users',
      },
      authenticated: {
        limit: 10,
        window: '15 minutes',
        description: 'IP-based rate limiting for authenticated users',
      },
      plans: {
        free: {
          monthlyLimit: 10,
          description: 'Free plan monthly usage limit',
        },
        pro: {
          monthlyLimit: 100,
          description: 'Pro plan monthly usage limit',
        },
        team: {
          monthlyLimit: 'Unlimited',
          description: 'Team plan unlimited usage',
        },
      },
    };
  }
}
