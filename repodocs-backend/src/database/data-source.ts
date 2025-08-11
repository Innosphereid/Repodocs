import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from './entities/entities-array';
import { CreateInitialSchema1700000000000 } from './migrations/1700000000000-CreateInitialSchema';
import { AddPasswordHashColumn1700000000002 } from './migrations/1700000000002-AddPasswordHashColumn';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: entities,
  migrations: [
    CreateInitialSchema1700000000000,
    AddPasswordHashColumn1700000000002,
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  extra: {
    max: 20,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
});
