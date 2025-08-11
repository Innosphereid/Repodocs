import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum EventType {
  SYSTEM_STARTUP = 'system_startup',
  REPOSITORY_ANALYZED = 'repository_analyzed',
  PR_CREATED = 'pr_created',
  PR_MERGED = 'pr_merged',
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  AI_PROCESSING_STARTED = 'ai_processing_started',
  AI_PROCESSING_COMPLETED = 'ai_processing_completed',
  AI_PROCESSING_FAILED = 'ai_processing_failed',
}

@Entity('system_analytics')
export class SystemAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'event_type',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @Index()
  eventType: EventType;

  @Column({ name: 'event_data', type: 'jsonb', nullable: true })
  eventData: Record<string, any>;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'user_ip_hash', type: 'varchar', length: 64, nullable: true })
  userIpHash: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;
}
