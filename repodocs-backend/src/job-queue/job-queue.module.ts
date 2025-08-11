import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobQueueService } from './job-queue.service';
import { JobQueueController } from './job-queue.controller';
import { RepositoryAnalysisProcessor } from './processors/repository-analysis.processor';
import { DocumentationGenerationProcessor } from './processors/documentation-generation.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
        defaultJobOptions: {
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 50, // Retry failed jobs 3 times
          attempts: 3, // Retry failed jobs 3 times
          backoff: {
            type: 'exponential',
            delay: 2000, // Start with 2 seconds
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'repository-analysis',
      },
      {
        name: 'documentation-generation',
      },
    ),
  ],
  controllers: [JobQueueController],
  providers: [
    JobQueueService,
    RepositoryAnalysisProcessor,
    DocumentationGenerationProcessor,
  ],
  exports: [JobQueueService, BullModule],
})
export class JobQueueModule {}
