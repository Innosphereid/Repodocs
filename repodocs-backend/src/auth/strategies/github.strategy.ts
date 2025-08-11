import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('github.clientId'),
      clientSecret: configService.get('github.clientSecret'),
      callbackURL: `${configService.get('app.backendUrl') || 'http://localhost:3001'}/api/v1/auth/github/callback`,
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const { id, username, emails, photos } = profile;

      // Get user email from GitHub profile
      const email = emails && emails.length > 0 ? emails[0].value : undefined;

      // Get avatar URL from GitHub profile
      const avatarUrl =
        photos && photos.length > 0 ? photos[0].value : undefined;

      // Validate or create user
      const user = await this.authService.validateUser(
        parseInt(id),
        username,
        email,
        avatarUrl,
      );

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
