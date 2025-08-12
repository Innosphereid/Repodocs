import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPasswordHashColumn1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if password_hash column already exists
    const hasColumn = await queryRunner.hasColumn('users', 'password_hash');
    
    if (!hasColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'password_hash',
          type: 'text',
          isNullable: true,
        }),
      );
      console.log('✅ Added password_hash column to users table');
    } else {
      console.log('ℹ️ password_hash column already exists in users table');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if password_hash column exists before trying to drop it
    const hasColumn = await queryRunner.hasColumn('users', 'password_hash');
    
    if (hasColumn) {
      await queryRunner.dropColumn('users', 'password_hash');
      console.log('✅ Removed password_hash column from users table');
    } else {
      console.log('ℹ️ password_hash column does not exist in users table');
    }
  }
}
