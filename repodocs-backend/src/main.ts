import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './utils/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new LoggerService();
  logger.setContext({ service: 'Main' });

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.info(`Application started successfully`, {
    method: 'bootstrap',
    port,
    environment: process.env.NODE_ENV || 'development',
  });

  logger.info(`Server configuration`, {
    method: 'bootstrap',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    globalPrefix: 'api/v1',
    githubOAuthCallback: `http://localhost:${port}/api/v1/auth/github/callback`,
  });

  logger.info(`Features enabled`, {
    method: 'bootstrap',
    authentication: 'GitHub OAuth enabled',
    rateLimiting: 'IP-based and user-based limits active',
    cache: 'Redis integration enabled',
    jobQueue: 'Bull queue with Redis backend',
  });

  // Check critical environment variables
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

  logger.info(`Environment variables check`, {
    method: 'bootstrap',
    hasGithubClientId: !!githubClientId,
    hasGithubClientSecret: !!githubClientSecret,
    githubClientIdLength: githubClientId?.length || 0,
    githubClientSecretLength: githubClientSecret?.length || 0,
  });

  if (!githubClientId || !githubClientSecret) {
    logger.warn(`GitHub OAuth may not work properly`, {
      method: 'bootstrap',
      message:
        'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required for OAuth to work',
      hasGithubClientId: !!githubClientId,
      hasGithubClientSecret: !!githubClientSecret,
    });
  }
}
bootstrap();
