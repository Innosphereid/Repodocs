import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { LoggerService } from '../utils';

@Controller('health')
export class HealthController {
  constructor(
    private dataSource: DataSource,
    private logger: LoggerService,
  ) {
    this.logger.setContext({ service: 'HealthController' });
  }

  @Get()
  async check(@Res() res: Response) {
    this.logger.info('Health check requested');

    try {
      // Check database connection
      const isConnected = this.dataSource.isInitialized;

      if (!isConnected) {
        this.logger.error('Database connection failed');
        return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
          status: 'error',
          message: 'Database connection failed',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
        });
      }

      // Test database query
      await this.dataSource.query('SELECT 1');
      this.logger.debug('Database query test successful');

      this.logger.info('Health check completed successfully');
      return res.status(HttpStatus.OK).json({
        status: 'healthy',
        message: 'Service is running',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      });
    } catch (error) {
      this.logger.errorWithStack('Health check failed', error);
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        database: 'error',
        error: error.message,
      });
    }
  }
}
