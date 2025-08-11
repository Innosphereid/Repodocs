import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async check(@Res() res: Response) {
    try {
      // Check database connection
      const isConnected = this.dataSource.isInitialized;
      
      if (!isConnected) {
        return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
          status: 'error',
          message: 'Database connection failed',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
        });
      }

      // Test database query
      await this.dataSource.query('SELECT 1');

      return res.status(HttpStatus.OK).json({
        status: 'healthy',
        message: 'Service is running',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      });
    } catch (error) {
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
