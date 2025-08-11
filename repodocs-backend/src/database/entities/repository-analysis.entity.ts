import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { GeneratedDocumentation } from './generated-documentation.entity';
import { AiUsageLog } from './ai-usage-log.entity';

export enum AnalysisStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('repository_analyses')
export class RepositoryAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index()
  userId: string;

  @Column({ name: 'user_ip_hash', type: 'varchar', length: 64, nullable: true })
  userIpHash: string;

  @Column({ name: 'repository_url', type: 'text', nullable: false })
  repositoryUrl: string;

  @Column({
    name: 'repository_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  repositoryName: string;

  @Column({
    name: 'repository_owner',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  repositoryOwner: string;

  @Column({
    name: 'primary_language',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  primaryLanguage: string;

  @Column({
    name: 'framework_detected',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  frameworkDetected: string;

  @Column({ name: 'file_count', type: 'int', nullable: true })
  fileCount: number;

  @Column({ name: 'total_size_bytes', type: 'bigint', nullable: true })
  totalSizeBytes: number;

  @Column({
    name: 'analysis_status',
    type: 'varchar',
    length: 20,
    default: AnalysisStatus.PENDING,
  })
  @Index()
  analysisStatus: AnalysisStatus;

  @Column({
    name: 'ai_model_used',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  aiModelUsed: string;

  @Column({ name: 'processing_time_seconds', type: 'int', nullable: true })
  processingTimeSeconds: number;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.repositoryAnalyses, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => GeneratedDocumentation, doc => doc.analysis)
  generatedDocumentation: GeneratedDocumentation[];

  @OneToMany(() => AiUsageLog, log => log.analysis)
  aiUsageLogs: AiUsageLog[];
}
