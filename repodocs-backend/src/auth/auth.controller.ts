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
import {
  RefreshTokenDto,
  AuthResponseDto,
  AuthStatusDto,
  LocalAuthDto,
  CreateUserDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // GitHub OAuth will handle this
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as any;
      const authResponse = await this.authService.login(user);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/callback?token=${authResponse.access_token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      const errorUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/error`;
      res.redirect(errorUrl);
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
