import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from '../src/database/entities/entities-array';

// Load environment variables
config();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📊 Database URL:', process.env.DATABASE_URL);

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: Object.values(entities),
    synchronize: false, // Don't sync in test
    logging: true,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');

    // Test basic query
    const result = await dataSource.query('SELECT version()');
    console.log('📋 PostgreSQL version:', result[0].version);

    // Test UUID extension
    try {
      await dataSource.query('SELECT uuid_generate_v4()');
      console.log('✅ UUID extension is available');
    } catch (error) {
      console.log('⚠️  UUID extension not available, will be created during migration');
    }

    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
