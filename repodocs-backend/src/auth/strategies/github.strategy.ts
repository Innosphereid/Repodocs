import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { LoggerService } from '../../utils/logger/logger.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new LoggerService();

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientId = configService.get('github.clientId');
    const clientSecret = configService.get('github.clientSecret');
    const backendUrl =
      configService.get('app.backendUrl') || 'http://localhost:3001';
    const callbackURL = `${backendUrl}/api/v1/auth/github/callback`;

    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL,
      scope: ['user:email', 'read:user'],
    });

    // Log OAuth configuration for debugging
    this.logger.info('GitHub Strategy configuration', {
      method: 'constructor',
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      backendUrl,
      callbackURL,
    });

    if (!clientId || !clientSecret) {
      this.logger.error('GitHub OAuth configuration missing', {
        method: 'constructor',
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        message:
          'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set in environment variables',
      });
    }

    this.logger.setContext({ service: 'GitHubStrategy' });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    this.logger.info('GitHub Strategy validate called', {
      method: 'validate',
      profileId: profile.id,
      profileUsername: profile.username,
      hasEmails: !!profile.emails?.length,
      hasPhotos: !!profile.photos?.length,
    });

    try {
      const { id, username, emails, photos } = profile;

      // Get user email from GitHub profile
      const email = emails && emails.length > 0 ? emails[0].value : undefined;
      this.logger.debug('User email extracted from GitHub profile', {
        method: 'validate',
        email,
        profileId: id,
      });

      // Get avatar URL from GitHub profile
      const avatarUrl =
        photos && photos.length > 0 ? photos[0].value : undefined;
      this.logger.debug('Avatar URL extracted from GitHub profile', {
        method: 'validate',
        avatarUrl,
        profileId: id,
      });

      // Validate or create user
      this.logger.info('Validating/creating user from GitHub profile', {
        method: 'validate',
        profileId: id,
        username,
        email,
      });

      const user = await this.authService.validateUser(
        parseInt(id),
        username,
        email,
        avatarUrl,
      );

      this.logger.info('User validated/created successfully', {
        method: 'validate',
        userId: user.id,
        username: user.username,
        profileId: id,
      });

      done(null, user);
    } catch (error) {
      this.logger.errorWithStack('GitHub Strategy validate failed', error, {
        method: 'validate',
        profileId: profile?.id,
        username: profile?.username,
      });
      done(error, null);
    }
  }
}
