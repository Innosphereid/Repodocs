import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './auth.service';
import { LoggerService } from '../utils/logger/logger.service';
import {
  RefreshTokenDto,
  AuthResponseDto,
  AuthStatusDto,
  LocalAuthDto,
  CreateUserDto,
} from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new LoggerService();

  constructor(private readonly authService: AuthService) {
    this.logger.setContext({ service: 'AuthController' });
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // GitHub OAuth will handle this
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    this.logger.info('GitHub OAuth callback received', {
      method: 'githubAuthCallback',
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    try {
      const user = req.user as any;
      this.logger.info('User validated from GitHub OAuth', {
        method: 'githubAuthCallback',
        userId: user?.id,
        username: user?.username,
        email: user?.email,
      });

      const authResponse = await this.authService.login(user);
      this.logger.info('Auth response generated successfully', {
        method: 'githubAuthCallback',
        hasToken: !!authResponse.access_token,
        tokenLength: authResponse.access_token?.length,
        userId: user?.id,
      });

      // Redirect to frontend with token
      const redirectUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/callback?token=${authResponse.access_token}`;
      this.logger.info('Redirecting to frontend with token', {
        method: 'githubAuthCallback',
        redirectUrl,
        userId: user?.id,
      });

      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.errorWithStack('GitHub OAuth callback failed', error, {
        method: 'githubAuthCallback',
        userId: (req.user as any)?.id,
        url: req.url,
      });

      const errorUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/error`;
      this.logger.warn('Redirecting to error page due to OAuth failure', {
        method: 'githubAuthCallback',
        errorUrl,
        error: error.message,
      });

      res.redirect(errorUrl);
    }
  }

  @Post('github/exchange')
  @HttpCode(HttpStatus.OK)
  async githubCodeExchange(@Body() body: { code: string; state: string }) {
    this.logger.info('GitHub OAuth code exchange requested', {
      method: 'githubCodeExchange',
      hasCode: !!body.code,
      hasState: !!body.state,
    });

    try {
      // This endpoint will handle the OAuth code exchange manually
      // since we can't use passport strategy for POST requests
      const authResponse = await this.authService.exchangeGitHubCode(
        body.code,
        body.state,
      );

      this.logger.info('GitHub OAuth code exchange successful', {
        method: 'githubCodeExchange',
        hasToken: !!authResponse.access_token,
        userId: authResponse.user?.id,
      });

      return authResponse;
    } catch (error) {
      this.logger.errorWithStack('GitHub OAuth code exchange failed', error, {
        method: 'githubCodeExchange',
        code: body.code,
      });
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async localLogin(@Body() localAuthDto: LocalAuthDto) {
    const user = await this.authService.validateLocalUser(
      localAuthDto.username,
      localAuthDto.password,
    );
    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async localRegister(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createLocalUser(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );
    return this.authService.login(user);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@CurrentUser() user: JwtPayload) {
    return this.authService.refreshToken(user.sub);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getUserById(user.sub);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getUserDashboard(@CurrentUser() user: JwtPayload) {
    this.logger.info('User dashboard requested', {
      method: 'getUserDashboard',
      userId: user.sub,
      username: user.username,
    });

    try {
      const dashboardData = await this.authService.getUserDashboard(user.sub);

      this.logger.info('User dashboard retrieved successfully', {
        method: 'getUserDashboard',
        userId: user.sub,
        hasRecentAnalyses: dashboardData.recent_analyses.length > 0,
        totalRepositories: dashboardData.usage_stats.total_repositories,
        successfulGenerations: dashboardData.usage_stats.successful_generations,
      });

      return dashboardData;
    } catch (error) {
      this.logger.errorWithStack('Failed to get user dashboard', error, {
        method: 'getUserDashboard',
        userId: user.sub,
      });
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout() {
    // JWT is stateless, so we just return success
    // In a real app, you might want to blacklist the token
    return { message: 'Logged out successfully' };
  }

  @Get('status')
  async getAuthStatus(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false };
    }

    try {
      const token = authHeader.substring(7);
      const payload = await this.authService.validateToken(token);
      return {
        authenticated: true,
        user: {
          id: payload.sub,
          username: payload.username,
          planType: payload.planType,
        },
      };
    } catch (error) {
      return { authenticated: false };
    }
  }
}
