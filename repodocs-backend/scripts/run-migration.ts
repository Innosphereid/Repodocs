import { AppDataSource } from '../src/database/data-source';

async function runMigration() {
  console.log('🚀 Starting database migration...');
  console.log('📊 Database URL:', process.env.DATABASE_URL);

  const dataSource = AppDataSource;

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Run migrations
    await dataSource.runMigrations();
    console.log('✅ Migrations completed successfully');

    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
