import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RepositoryAnalysis,
  AnalysisStatus,
} from '../database/entities/repository-analysis.entity';
import { User } from '../database/entities/user.entity';
import { RateLimitingService } from '../rate-limiting';
import { JobQueueService } from '../job-queue';

export interface RepositoryValidationResult {
  isValid: boolean;
  repositoryName: string;
  repositoryOwner: string;
  isPublic: boolean;
  error?: string;
}

export interface RepositoryAnalysisRequest {
  repositoryUrl: string;
  userId?: string;
  userIp: string;
}

@Injectable()
export class RepositoryAnalysisService {
  private readonly logger = new Logger(RepositoryAnalysisService.name);

  constructor(
    @InjectRepository(RepositoryAnalysis)
    private readonly repositoryAnalysisRepository: Repository<RepositoryAnalysis>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rateLimitingService: RateLimitingService,
    private readonly jobQueueService: JobQueueService,
  ) {}

  async validateRepositoryUrl(
    repositoryUrl: string,
  ): Promise<RepositoryValidationResult> {
    try {
      // Basic URL validation
      if (!repositoryUrl.includes('github.com')) {
        return {
          isValid: false,
          repositoryName: '',
          repositoryOwner: '',
          isPublic: false,
          error: 'Only GitHub repositories are supported',
        };
      }

      // Extract repository owner and name from URL
      const urlParts = repositoryUrl.split('/');
      const githubIndex = urlParts.findIndex(part => part === 'github.com');

      if (githubIndex === -1 || githubIndex + 2 >= urlParts.length) {
        return {
          isValid: false,
          repositoryName: '',
          repositoryOwner: '',
          isPublic: false,
          error: 'Invalid GitHub repository URL format',
        };
      }

      const repositoryOwner = urlParts[githubIndex + 1];
      const repositoryName = urlParts[githubIndex + 2].replace('.git', '');

      // TODO: In Phase 2.1, implement actual GitHub API validation
      // For now, we'll assume the repository is valid if the URL format is correct
      const isValid = repositoryOwner && repositoryName;

      return {
        isValid: Boolean(isValid),
        repositoryName,
        repositoryOwner,
        isPublic: true, // Assume public for now
        error: isValid ? undefined : 'Invalid repository URL',
      };
    } catch (error) {
      this.logger.error('Error validating repository URL:', error);
      return {
        isValid: false,
        repositoryName: '',
        repositoryOwner: '',
        isPublic: false,
        error: 'Error validating repository URL',
      };
    }
  }

  async createAnalysis(
    request: RepositoryAnalysisRequest,
  ): Promise<RepositoryAnalysis> {
    try {
      // Validate repository URL
      const validation = await this.validateRepositoryUrl(
        request.repositoryUrl,
      );
      if (!validation.isValid) {
        throw new BadRequestException(validation.error);
      }

      // Check rate limits for document generation
      const rateLimitStatus =
        await this.rateLimitingService.checkDocumentGenerationRateLimit(
          request.userIp,
          request.userId,
        );

      if (!rateLimitStatus.allowed) {
        throw new ForbiddenException(
          `Monthly document generation limit exceeded. Your ${rateLimitStatus.planType} plan allows ${rateLimitStatus.limit} generations per month.`,
        );
      }

      // Create analysis record
      const analysis = this.repositoryAnalysisRepository.create({
        userId: request.userId,
        userIpHash: request.userId ? undefined : this.hashIp(request.userIp),
        repositoryUrl: request.repositoryUrl,
        repositoryName: validation.repositoryName,
        repositoryOwner: validation.repositoryOwner,
        analysisStatus: AnalysisStatus.PENDING,
        createdAt: new Date(),
      });

      const savedAnalysis =
        await this.repositoryAnalysisRepository.save(analysis);

      // Add job to queue for background processing
      await this.jobQueueService.addRepositoryAnalysisJob({
        repositoryUrl: request.repositoryUrl,
        userId: request.userId,
        userIp: request.userIp,
      });

      // Increment user usage if authenticated
      if (request.userId) {
        await this.rateLimitingService.incrementUserUsage(request.userId);
      }

      this.logger.log(
        `Created analysis ${savedAnalysis.id} for ${request.repositoryUrl}`,
      );
      return savedAnalysis;
    } catch (error) {
      this.logger.error('Error creating repository analysis:', error);
      throw error;
    }
  }

  async getAnalysisById(
    analysisId: string,
    userId?: string,
  ): Promise<RepositoryAnalysis> {
    try {
      const analysis = await this.repositoryAnalysisRepository.findOne({
        where: { id: analysisId },
        relations: ['user'],
      });

      if (!analysis) {
        throw new BadRequestException('Analysis not found');
      }

      // Check if user has access to this analysis
      if (userId && analysis.userId && analysis.userId !== userId) {
        throw new ForbiddenException('Access denied to this analysis');
      }

      return analysis;
    } catch (error) {
      this.logger.error(`Error getting analysis ${analysisId}:`, error);
      throw error;
    }
  }

  async getUserAnalyses(userId: string): Promise<RepositoryAnalysis[]> {
    try {
      return await this.repositoryAnalysisRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Error getting analyses for user ${userId}:`, error);
      throw error;
    }
  }

  async updateAnalysisStatus(
    analysisId: string,
    status: string,
    additionalData?: any,
  ): Promise<RepositoryAnalysis> {
    try {
      const analysis = await this.repositoryAnalysisRepository.findOne({
        where: { id: analysisId },
      });

      if (!analysis) {
        throw new BadRequestException('Analysis not found');
      }

      analysis.analysisStatus = status as AnalysisStatus;

      if (additionalData) {
        if (additionalData.primaryLanguage) {
          analysis.primaryLanguage = additionalData.primaryLanguage;
        }
        if (additionalData.frameworkDetected) {
          analysis.frameworkDetected = additionalData.frameworkDetected;
        }
        if (additionalData.fileCount) {
          analysis.fileCount = additionalData.fileCount;
        }
        if (additionalData.totalSizeBytes) {
          analysis.totalSizeBytes = additionalData.totalSizeBytes;
        }
        if (additionalData.aiModelUsed) {
          analysis.aiModelUsed = additionalData.aiModelUsed;
        }
        if (additionalData.processingTimeSeconds) {
          analysis.processingTimeSeconds = additionalData.processingTimeSeconds;
        }
      }

      if (status === 'completed' || status === 'failed') {
        analysis.completedAt = new Date();
      }

      return await this.repositoryAnalysisRepository.save(analysis);
    } catch (error) {
      this.logger.error(`Error updating analysis ${analysisId}:`, error);
      throw error;
    }
  }

  private hashIp(ip: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip).digest('hex');
  }
}
