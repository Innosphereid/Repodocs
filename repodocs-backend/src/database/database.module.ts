import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '../config/env.config';
import { entities } from './entities/entities-array';
import { CreateInitialSchema1700000000000 } from './migrations/1700000000000-CreateInitialSchema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        
        return {
          type: 'postgres',
          url: dbConfig.url,
          entities: Object.values(entities),
          synchronize: false, // Disable auto-sync, use migrations instead
          migrations: [CreateInitialSchema1700000000000], // Include migrations
          migrationsRun: false, // Don't auto-run migrations, run manually
          logging: configService.get('app.nodeEnv') === 'development',
          ssl: configService.get('app.nodeEnv') === 'production' ? { rejectUnauthorized: false } : false,
          extra: {
            max: 20, // Maximum number of connections in the pool
            connectionTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
