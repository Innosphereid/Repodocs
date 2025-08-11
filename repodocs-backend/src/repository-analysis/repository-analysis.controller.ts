import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  RepositoryAnalysisService,
  RepositoryAnalysisRequest,
} from './repository-analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/auth.service';
import {
  RepositoryAnalysisRequestDto,
  RepositoryValidationResponseDto,
  RepositoryAnalysisResponseDto,
  AnalysisStatusResponseDto,
} from './dto';

@Controller('repository-analysis')
export class RepositoryAnalysisController {
  constructor(
    private readonly repositoryAnalysisService: RepositoryAnalysisService,
  ) {}

  @Post('validate')
  async validateRepository(@Body() body: { repositoryUrl: string }) {
    return this.repositoryAnalysisService.validateRepositoryUrl(
      body.repositoryUrl,
    );
  }

  @Post('analyze')
  async createAnalysis(
    @Body() body: { repositoryUrl: string },
    @Req() req: Request,
  ) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    const request: RepositoryAnalysisRequest = {
      repositoryUrl: body.repositoryUrl,
      userIp: clientIp,
    };

    return this.repositoryAnalysisService.createAnalysis(request);
  }

  @Post('analyze/authenticated')
  @UseGuards(JwtAuthGuard)
  async createAuthenticatedAnalysis(
    @Body() body: { repositoryUrl: string },
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    const request: RepositoryAnalysisRequest = {
      repositoryUrl: body.repositoryUrl,
      userId: user.sub,
      userIp: clientIp,
    };

    return this.repositoryAnalysisService.createAnalysis(request);
  }

  @Get(':analysisId')
  async getAnalysis(@Param('analysisId') analysisId: string) {
    return this.repositoryAnalysisService.getAnalysisById(analysisId);
  }

  @Get('user/authenticated')
  @UseGuards(JwtAuthGuard)
  async getUserAnalyses(@CurrentUser() user: JwtPayload) {
    return this.repositoryAnalysisService.getUserAnalyses(user.sub);
  }

  @Get('status/:analysisId')
  async getAnalysisStatus(@Param('analysisId') analysisId: string) {
    const analysis =
      await this.repositoryAnalysisService.getAnalysisById(analysisId);
    return {
      id: analysis.id,
      status: analysis.analysisStatus,
      createdAt: analysis.createdAt,
      completedAt: analysis.completedAt,
      repositoryUrl: analysis.repositoryUrl,
      repositoryName: analysis.repositoryName,
      repositoryOwner: analysis.repositoryOwner,
    };
  }
}
