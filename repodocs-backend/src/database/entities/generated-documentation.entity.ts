import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { RepositoryAnalysis } from './repository-analysis.entity';

export enum PrStatus {
  CREATED = 'created',
  MERGED = 'merged',
  CLOSED = 'closed',
}

@Entity('generated_documentation')
export class GeneratedDocumentation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'analysis_id', type: 'uuid', nullable: false })
  @Index()
  analysisId: string;

  @Column({ name: 'original_readme_content', type: 'text', nullable: true })
  originalReadmeContent: string;

  @Column({ name: 'generated_content', type: 'text', nullable: false })
  generatedContent: string;

  @Column({ name: 'content_sections', type: 'jsonb', nullable: true })
  contentSections: {
    description?: string;
    installation?: string;
    usage?: string;
    api?: string;
    contributing?: string;
    [key: string]: string | undefined;
  };

  @Column({ name: 'github_pr_number', type: 'int', nullable: true })
  githubPrNumber: number;

  @Column({ name: 'github_pr_url', type: 'text', nullable: true })
  githubPrUrl: string;

  @Column({
    name: 'pr_status',
    type: 'varchar',
    length: 20,
    default: PrStatus.CREATED,
  })
  prStatus: PrStatus;

  @Column({
    name: 'user_feedback_rating',
    type: 'int',
    nullable: true,
  })
  @Check('user_feedback_rating >= 1 AND user_feedback_rating <= 5')
  userFeedbackRating: number;

  @Column({ name: 'user_feedback_comment', type: 'text', nullable: true })
  userFeedbackComment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => RepositoryAnalysis, (analysis) => analysis.generatedDocumentation)
  @JoinColumn({ name: 'analysis_id' })
  analysis: RepositoryAnalysis;
}
