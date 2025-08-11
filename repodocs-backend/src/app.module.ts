import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { SeederModule } from './database/seeds';
import { HealthModule } from './health';
import { LoggerModule } from './utils';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SeederModule,
    HealthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
