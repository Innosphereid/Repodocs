import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1700000000000 implements MigrationInterface {
  name = 'CreateInitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "github_id" bigint,
        "username" character varying(255) NOT NULL,
        "email" character varying(255),
        "avatar_url" text,
        "github_token_encrypted" text,
        "plan_type" character varying(20) NOT NULL DEFAULT 'free',
        "monthly_usage_count" integer NOT NULL DEFAULT '0',
        "usage_reset_date" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Create repository_analyses table
    await queryRunner.query(`
      CREATE TABLE "repository_analyses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "user_ip_hash" character varying(64),
        "repository_url" text NOT NULL,
        "repository_name" character varying(255) NOT NULL,
        "repository_owner" character varying(255) NOT NULL,
        "primary_language" character varying(50),
        "framework_detected" character varying(100),
        "file_count" integer,
        "total_size_bytes" bigint,
        "analysis_status" character varying(20) NOT NULL DEFAULT 'pending',
        "ai_model_used" character varying(50),
        "processing_time_seconds" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "completed_at" TIMESTAMP,
        CONSTRAINT "PK_repository_analyses_id" PRIMARY KEY ("id")
      )
    `);

    // Create generated_documentation table
    await queryRunner.query(`
      CREATE TABLE "generated_documentation" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "analysis_id" uuid NOT NULL,
        "original_readme_content" text,
        "generated_content" text NOT NULL,
        "content_sections" jsonb,
        "github_pr_number" integer,
        "github_pr_url" text,
        "pr_status" character varying(20) NOT NULL DEFAULT 'created',
        "user_feedback_rating" integer,
        "user_feedback_comment" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_generated_documentation_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_user_feedback_rating" CHECK ("user_feedback_rating" >= 1 AND "user_feedback_rating" <= 5)
      )
    `);

    // Create rate_limits table
    await queryRunner.query(`
      CREATE TABLE "rate_limits" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ip_hash" character varying(64) NOT NULL,
        "usage_count" integer NOT NULL DEFAULT '1',
        "last_reset_date" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rate_limits_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_rate_limits_ip_hash" UNIQUE ("ip_hash")
      )
    `);

    // Create ai_usage_logs table
    await queryRunner.query(`
      CREATE TABLE "ai_usage_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "analysis_id" uuid NOT NULL,
        "provider" character varying(20) NOT NULL,
        "model" character varying(50) NOT NULL,
        "input_tokens" integer,
        "output_tokens" integer,
        "cost_usd" decimal(10,6),
        "latency_ms" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ai_usage_logs_id" PRIMARY KEY ("id")
      )
    `);

    // Create system_analytics table
    await queryRunner.query(`
      CREATE TABLE "system_analytics" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event_type" character varying(50) NOT NULL,
        "event_data" jsonb,
        "user_id" uuid,
        "user_ip_hash" character varying(64),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_system_analytics_id" PRIMARY KEY ("id")
      )
    `);

    // Create foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "repository_analyses" 
      ADD CONSTRAINT "FK_repository_analyses_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "generated_documentation" 
      ADD CONSTRAINT "FK_generated_documentation_analysis_id" 
      FOREIGN KEY ("analysis_id") REFERENCES "repository_analyses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "ai_usage_logs" 
      ADD CONSTRAINT "FK_ai_usage_logs_analysis_id" 
      FOREIGN KEY ("analysis_id") REFERENCES "repository_analyses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Create indexes for performance optimization
    await queryRunner.query(`CREATE INDEX "IDX_users_github_id" ON "users" ("github_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_username" ON "users" ("username")`);
    await queryRunner.query(`CREATE INDEX "IDX_repository_analyses_user_id" ON "repository_analyses" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_repository_analyses_status" ON "repository_analyses" ("analysis_status")`);
    await queryRunner.query(`CREATE INDEX "IDX_repository_analyses_created_at" ON "repository_analyses" ("created_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_generated_documentation_analysis_id" ON "generated_documentation" ("analysis_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_rate_limits_ip_hash" ON "rate_limits" ("ip_hash")`);
    await queryRunner.query(`CREATE INDEX "IDX_ai_usage_logs_analysis_id" ON "ai_usage_logs" ("analysis_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_system_analytics_event_type" ON "system_analytics" ("event_type")`);
    await queryRunner.query(`CREATE INDEX "IDX_system_analytics_created_at" ON "system_analytics" ("created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_system_analytics_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_system_analytics_event_type"`);
    await queryRunner.query(`DROP INDEX "IDX_ai_usage_logs_analysis_id"`);
    await queryRunner.query(`DROP INDEX "IDX_rate_limits_ip_hash"`);
    await queryRunner.query(`DROP INDEX "IDX_generated_documentation_analysis_id"`);
    await queryRunner.query(`DROP INDEX "IDX_repository_analyses_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_repository_analyses_status"`);
    await queryRunner.query(`DROP INDEX "IDX_repository_analyses_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_users_username"`);
    await queryRunner.query(`DROP INDEX "IDX_users_github_id"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "ai_usage_logs" DROP CONSTRAINT "FK_ai_usage_logs_analysis_id"`);
    await queryRunner.query(`ALTER TABLE "generated_documentation" DROP CONSTRAINT "FK_generated_documentation_analysis_id"`);
    await queryRunner.query(`ALTER TABLE "repository_analyses" DROP CONSTRAINT "FK_repository_analyses_user_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "system_analytics"`);
    await queryRunner.query(`DROP TABLE "ai_usage_logs"`);
    await queryRunner.query(`DROP TABLE "rate_limits"`);
    await queryRunner.query(`DROP TABLE "generated_documentation"`);
    await queryRunner.query(`DROP TABLE "repository_analyses"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
