import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { SeederModule } from './database/seeds';
import { HealthModule } from './health';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SeederModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
