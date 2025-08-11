import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from '../src/database/entities/entities-array';
import { CreateInitialSchema1700000000000 } from '../src/database/migrations/1700000000000-CreateInitialSchema';

// Load environment variables
config();

async function runMigration() {
  console.log('🚀 Starting database migration...');
  console.log('📊 Database URL:', process.env.DATABASE_URL);

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: Object.values(entities),
    migrations: [CreateInitialSchema1700000000000],
    synchronize: false,
    logging: true,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

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
