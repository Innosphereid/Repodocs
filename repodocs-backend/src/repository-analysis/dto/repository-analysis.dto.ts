import { IsString, IsUrl, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class RepositoryAnalysisRequestDto {
  @IsUrl()
  repositoryUrl: string;
}

export class RepositoryValidationResponseDto {
  @IsString()
  isValid: boolean;

  @IsString()
  repositoryName: string;

  @IsString()
  repositoryOwner: string;

  @IsString()
  isPublic: boolean;

  @IsOptional()
  @IsString()
  error?: string;
}

export class RepositoryAnalysisResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  repositoryUrl: string;

  @IsString()
  repositoryName: string;

  @IsString()
  repositoryOwner: string;

  @IsString()
  analysisStatus: string;

  @IsOptional()
  @IsString()
  primaryLanguage?: string;

  @IsOptional()
  @IsString()
  frameworkDetected?: string;

  @IsOptional()
  fileCount?: number;

  @IsOptional()
  totalSizeBytes?: number;

  @IsOptional()
  @IsString()
  aiModelUsed?: string;

  @IsOptional()
  processingTimeSeconds?: number;

  @IsOptional()
  @IsUUID()
  userId?: string;

  createdAt: Date;
  completedAt?: Date;
}

export class AnalysisStatusResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  status: string;

  @IsString()
  repositoryUrl: string;

  @IsString()
  repositoryName: string;

  @IsString()
  repositoryOwner: string;

  createdAt: Date;
  completedAt?: Date;
}
