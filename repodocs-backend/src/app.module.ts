import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { SeederModule } from './database/seeds';
import { HealthModule } from './health';
import { LoggerModule } from './utils';
import { AuthModule } from './auth';
import { RateLimitingModule, RateLimitingMiddleware } from './rate-limiting';
import { AppCacheModule } from './cache';
import { JobQueueModule } from './job-queue';
import { RepositoryAnalysisModule } from './repository-analysis';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SeederModule,
    HealthModule,
    LoggerModule,
    AuthModule,
    RateLimitingModule,
    AppCacheModule,
    JobQueueModule,
    RepositoryAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
