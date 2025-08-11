import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { RepositoryAnalysis } from "./repository-analysis.entity";

export enum AiProvider {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
}

@Entity("ai_usage_logs")
export class AiUsageLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "analysis_id", type: "uuid", nullable: false })
  @Index()
  analysisId: string;

  @Column({
    name: "provider",
    type: "varchar",
    length: 20,
    nullable: false,
  })
  provider: AiProvider;

  @Column({ name: "model", type: "varchar", length: 50, nullable: false })
  model: string;

  @Column({ name: "input_tokens", type: "int", nullable: true })
  inputTokens: number;

  @Column({ name: "output_tokens", type: "int", nullable: true })
  outputTokens: number;

  @Column({
    name: "cost_usd",
    type: "decimal",
    precision: 10,
    scale: 6,
    nullable: true,
  })
  costUsd: number;

  @Column({ name: "latency_ms", type: "int", nullable: true })
  latencyMs: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // Relations
  @ManyToOne(() => RepositoryAnalysis, (analysis) => analysis.aiUsageLogs)
  @JoinColumn({ name: "analysis_id" })
  analysis: RepositoryAnalysis;
}
