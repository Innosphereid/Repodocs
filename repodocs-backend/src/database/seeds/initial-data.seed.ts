import { DataSource } from 'typeorm';
import { User, PlanType } from '../entities/user.entity';
import {
  SystemAnalytics,
  EventType,
} from '../entities/system-analytics.entity';

export class InitialDataSeed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    console.log('🌱 Starting initial data seed...');

    try {
      // Create system analytics events for initial setup
      await this.createSystemAnalytics();

      console.log('✅ Initial data seed completed successfully');
    } catch (error) {
      console.error('❌ Error during initial data seed:', error);
      throw error;
    }
  }

  private async createSystemAnalytics(): Promise<void> {
    const systemAnalyticsRepository =
      this.dataSource.getRepository(SystemAnalytics);

    const initialEvents = [
      {
        eventType: EventType.SYSTEM_STARTUP,
        eventData: {
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString(),
        },
        userIpHash: null,
      },
    ];

    for (const event of initialEvents) {
      const existingEvent = await systemAnalyticsRepository.findOne({
        where: {
          eventType: event.eventType,
          eventData: event.eventData,
        },
      });

      if (!existingEvent) {
        await systemAnalyticsRepository.save(event);
        console.log(`📊 Created system analytics event: ${event.eventType}`);
      }
    }
  }
}
