import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RepositoryAnalysis } from './repository-analysis.entity';

export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  TEAM = 'team',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'github_id', type: 'bigint', unique: true, nullable: true })
  @Index()
  githubId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string;

  @Column({ name: 'github_token_encrypted', type: 'text', nullable: true })
  githubTokenEncrypted: string;

  @Column({ name: 'password_hash', type: 'text', nullable: true })
  passwordHash: string;

  @Column({
    name: 'plan_type',
    type: 'varchar',
    length: 20,
    default: PlanType.FREE,
  })
  planType: PlanType;

  @Column({
    name: 'monthly_usage_count',
    type: 'int',
    default: 0,
  })
  monthlyUsageCount: number;

  @Column({
    name: 'usage_reset_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  usageResetDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => RepositoryAnalysis, analysis => analysis.user)
  repositoryAnalyses: RepositoryAnalysis[];
}
