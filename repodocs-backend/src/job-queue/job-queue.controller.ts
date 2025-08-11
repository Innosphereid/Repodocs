import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobQueueService } from './job-queue.service';

@Controller('jobs')
export class JobQueueController {
  constructor(private readonly jobQueueService: JobQueueService) {}

  @Get('status/:jobId/:queueName')
  @UseGuards(JwtAuthGuard)
  async getJobStatus(
    @Param('jobId') jobId: string,
    @Param('queueName') queueName: string,
  ) {
    return this.jobQueueService.getJobStatus(jobId, queueName);
  }

  @Get('stats/:queueName')
  @UseGuards(JwtAuthGuard)
  async getQueueStats(@Param('queueName') queueName: string) {
    return this.jobQueueService.getQueueStats(queueName);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getAllQueueStats() {
    const [repoAnalysis, docGeneration] = await Promise.all([
      this.jobQueueService.getQueueStats('repository-analysis'),
      this.jobQueueService.getQueueStats('documentation-generation'),
    ]);

    return {
      'repository-analysis': repoAnalysis,
      'documentation-generation': docGeneration,
    };
  }
}
