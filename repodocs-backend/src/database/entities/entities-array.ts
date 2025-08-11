// This file contains only entity classes for TypeORM configuration
import { User } from './user.entity';
import { RepositoryAnalysis } from './repository-analysis.entity';
import { GeneratedDocumentation } from './generated-documentation.entity';
import { RateLimit } from './rate-limit.entity';
import { AiUsageLog } from './ai-usage-log.entity';
import { SystemAnalytics } from './system-analytics.entity';

// Array of entity classes for TypeORM
export const entities = [
  User,
  RepositoryAnalysis,
  GeneratedDocumentation,
  RateLimit,
  AiUsageLog,
  SystemAnalytics,
];
