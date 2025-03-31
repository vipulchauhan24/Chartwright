import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartService } from './charts.service';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { DBModule } from '../db/db.module';

@Module({
  imports: [DBModule],
  controllers: [ChartsController],
  providers: [ChartService, S3ORM],
})
export class ChartsModule {}
