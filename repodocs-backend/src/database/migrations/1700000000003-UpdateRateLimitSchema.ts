import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRateLimitSchema1700000000003 implements MigrationInterface {
  name = 'UpdateRateLimitSchema1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add rate_limit_type column to rate_limits table
    await queryRunner.query(`
      ALTER TABLE "rate_limits" 
      ADD COLUMN "rate_limit_type" character varying(50) NOT NULL DEFAULT 'document_generation'
    `);

    // Add window_type column to distinguish between time-based and monthly limits
    await queryRunner.query(`
      ALTER TABLE "rate_limits" 
      ADD COLUMN "window_type" character varying(20) NOT NULL DEFAULT 'monthly'
    `);

    // Add window_duration_ms column for flexible time windows
    await queryRunner.query(`
      ALTER TABLE "rate_limits" 
      ADD COLUMN "window_duration_ms" bigint NOT NULL DEFAULT 2592000000
    `);

    // Create composite index for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_rate_limits_type_ip" ON "rate_limits" ("rate_limit_type", "ip_hash")
    `);

    // Update existing records to have proper defaults
    await queryRunner.query(`
      UPDATE "rate_limits" 
      SET "rate_limit_type" = 'document_generation', 
          "window_type" = 'monthly', 
          "window_duration_ms" = 2592000000
    `);

    // Add constraint to ensure valid rate limit types
    await queryRunner.query(`
      ALTER TABLE "rate_limits" 
      ADD CONSTRAINT "CHK_rate_limit_type" 
      CHECK ("rate_limit_type" IN ('document_generation', 'login_attempt', 'api_request'))
    `);

    // Add constraint to ensure valid window types
    await queryRunner.query(`
      ALTER TABLE "rate_limits" 
      ADD CONSTRAINT "CHK_window_type" 
      CHECK ("window_type" IN ('monthly', 'per_minute', 'per_hour', 'per_day'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop constraints
    await queryRunner.query(`
      ALTER TABLE "rate_limits" DROP CONSTRAINT "CHK_window_type"
    `);
    await queryRunner.query(`
      ALTER TABLE "rate_limits" DROP CONSTRAINT "CHK_rate_limit_type"
    `);

    // Drop index
    await queryRunner.query(`
      DROP INDEX "IDX_rate_limits_type_ip"
    `);

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "rate_limits" DROP COLUMN "window_duration_ms"
    `);
    await queryRunner.query(`
      ALTER TABLE "rate_limits" DROP COLUMN "window_type"
    `);
    await queryRunner.query(`
      ALTER TABLE "rate_limits" DROP COLUMN "rate_limit_type"
    `);
  }
}
