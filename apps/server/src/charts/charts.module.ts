import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartService } from './charts.service';
import { DynamoORM } from '../../db/orm/dynamoORM';
import { S3ORM } from '../../s3/orm/s3ORM';

@Module({
  controllers: [ChartsController],
  providers: [ChartService, DynamoORM, S3ORM],
})
export class ChartsModule {}
