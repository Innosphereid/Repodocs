import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import {
  databaseConfig,
  supabaseConfig,
  githubConfig,
  aiConfig,
  redisConfig,
  appConfig,
  rateLimitConfig,
  validationSchema,
} from './env.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        supabaseConfig,
        githubConfig,
        aiConfig,
        redisConfig,
        appConfig,
        rateLimitConfig,
      ],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: ['.env', '.env.local', '.env.development', '.env.production'],
    }),
  ],
})
export class ConfigModule {}
