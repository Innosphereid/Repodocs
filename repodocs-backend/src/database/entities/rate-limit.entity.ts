import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RateLimitType {
  DOCUMENT_GENERATION = 'document_generation',
  LOGIN_ATTEMPT = 'login_attempt',
  API_REQUEST = 'api_request',
}

export enum WindowType {
  MONTHLY = 'monthly',
  PER_MINUTE = 'per_minute',
  PER_HOUR = 'per_hour',
  PER_DAY = 'per_day',
}

@Entity('rate_limits')
export class RateLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'ip_hash',
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  @Index()
  ipHash: string;

  @Column({
    name: 'rate_limit_type',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: RateLimitType.DOCUMENT_GENERATION,
  })
  @Index()
  rateLimitType: RateLimitType;

  @Column({
    name: 'window_type',
    type: 'varchar',
    length: 20,
    nullable: false,
    default: WindowType.MONTHLY,
  })
  windowType: WindowType;

  @Column({
    name: 'window_duration_ms',
    type: 'bigint',
    nullable: false,
    default: 2592000000, // 30 days in milliseconds
  })
  windowDurationMs: number;

  @Column({ name: 'usage_count', type: 'int', default: 1 })
  usageCount: number;

  @Column({
    name: 'last_reset_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastResetDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
