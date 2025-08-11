import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitingController } from './rate-limiting.controller';
import { RateLimitingService } from './rate-limiting.service';
import { RateLimit } from '../database/entities/rate-limit.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RateLimit, User])],
  controllers: [RateLimitingController],
  providers: [RateLimitingService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
