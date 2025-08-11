import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { entities } from '../entities/entities-array';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
