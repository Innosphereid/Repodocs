import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryAnalysisController } from './repository-analysis.controller';
import { RepositoryAnalysisService } from './repository-analysis.service';
import { RepositoryAnalysis } from '../database/entities/repository-analysis.entity';
import { User } from '../database/entities/user.entity';
import { RateLimitingModule } from '../rate-limiting';
import { JobQueueModule } from '../job-queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([RepositoryAnalysis, User]),
    RateLimitingModule,
    JobQueueModule,
  ],
  controllers: [RepositoryAnalysisController],
  providers: [RepositoryAnalysisService],
  exports: [RepositoryAnalysisService],
})
export class RepositoryAnalysisModule {}
