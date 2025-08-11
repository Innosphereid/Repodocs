import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InitialDataSeed } from './initial-data.seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private dataSource: DataSource) {}

  async seed(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');

    try {
      // Run initial data seed
      const initialDataSeed = new InitialDataSeed(this.dataSource);
      await initialDataSeed.run();

      this.logger.log('✅ Database seeding completed successfully');
    } catch (error) {
      this.logger.error('❌ Error during database seeding:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.log('🧹 Starting database cleanup...');

    try {
      const entities = this.dataSource.entityMetadatas;

      for (const entity of entities) {
        const repository = this.dataSource.getRepository(entity.name);
        await repository.clear();
        this.logger.log(`🧹 Cleared ${entity.name} table`);
      }

      this.logger.log('✅ Database cleanup completed successfully');
    } catch (error) {
      this.logger.error('❌ Error during database cleanup:', error);
      throw error;
    }
  }
}
