import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('rate_limits')
export class RateLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'ip_hash',
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  @Index()
  ipHash: string;

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
