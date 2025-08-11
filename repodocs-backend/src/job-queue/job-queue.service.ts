import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface RepositoryAnalysisJobData {
  repositoryUrl: string;
  userId?: string;
  userIp: string;
}

export interface DocumentationGenerationJobData {
  analysisId: string;
  repositoryData: any;
  userId?: string;
}

@Injectable()
export class JobQueueService {
  private readonly logger = new Logger(JobQueueService.name);

  constructor(
    @InjectQueue('repository-analysis')
    private readonly repositoryAnalysisQueue: Queue<RepositoryAnalysisJobData>,
    @InjectQueue('documentation-generation')
    private readonly documentationGenerationQueue: Queue<DocumentationGenerationJobData>,
  ) {}

  async addRepositoryAnalysisJob(data: RepositoryAnalysisJobData) {
    try {
      const job = await this.repositoryAnalysisQueue.add('analyze', data, {
        priority: data.userId ? 1 : 2, // Authenticated users get higher priority
        delay: 0, // Process immediately
      });

      this.logger.log(
        `Added repository analysis job ${job.id} for ${data.repositoryUrl}`,
      );
      return job;
    } catch (error) {
      this.logger.error('Error adding repository analysis job:', error);
      throw error;
    }
  }

  async addDocumentationGenerationJob(data: DocumentationGenerationJobData) {
    try {
      const job = await this.documentationGenerationQueue.add(
        'generate',
        data,
        {
          priority: data.userId ? 1 : 2, // Authenticated users get higher priority
          delay: 0, // Process immediately
        },
      );

      this.logger.log(
        `Added documentation generation job ${job.id} for analysis ${data.analysisId}`,
      );
      return job;
    } catch (error) {
      this.logger.error('Error adding documentation generation job:', error);
      throw error;
    }
  }

  async getJobStatus(jobId: string, queueName: string): Promise<any> {
    try {
      let queue: Queue;

      switch (queueName) {
        case 'repository-analysis':
          queue = this.repositoryAnalysisQueue;
          break;
        case 'documentation-generation':
          queue = this.documentationGenerationQueue;
          break;
        default:
          throw new Error(`Unknown queue: ${queueName}`);
      }

      const job = await queue.getJob(jobId);
      if (!job) {
        return { status: 'not_found' };
      }

      const state = await job.getState();
      const progress = await job.progress();
      const result = job.returnvalue;
      const failedReason = job.failedReason;

      return {
        id: job.id,
        status: state,
        progress,
        result,
        failedReason,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      };
    } catch (error) {
      this.logger.error(`Error getting job status for ${jobId}:`, error);
      throw error;
    }
  }

  async getQueueStats(queueName: string): Promise<any> {
    try {
      let queue: Queue;

      switch (queueName) {
        case 'repository-analysis':
          queue = this.repositoryAnalysisQueue;
          break;
        case 'documentation-generation':
          queue = this.documentationGenerationQueue;
          break;
        default:
          throw new Error(`Unknown queue: ${queueName}`);
      }

      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
        queue.getDelayed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      };
    } catch (error) {
      this.logger.error(`Error getting queue stats for ${queueName}:`, error);
      throw error;
    }
  }

  async cleanQueue(
    queueName: string,
    olderThan: number = 24 * 60 * 60 * 1000,
  ): Promise<void> {
    try {
      let queue: Queue;

      switch (queueName) {
        case 'repository-analysis':
          queue = this.repositoryAnalysisQueue;
          break;
        case 'documentation-generation':
          queue = this.documentationGenerationQueue;
          break;
        default:
          throw new Error(`Unknown queue: ${queueName}`);
      }

      await queue.clean(olderThan, 'completed');
      await queue.clean(olderThan, 'failed');

      this.logger.log(`Cleaned queue ${queueName} (older than ${olderThan}ms)`);
    } catch (error) {
      this.logger.error(`Error cleaning queue ${queueName}:`, error);
      throw error;
    }
  }
}
