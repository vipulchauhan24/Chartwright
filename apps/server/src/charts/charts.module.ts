import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartService } from './charts.service';
import { DynamoORM } from '../lib/db/orm/dynamoORM';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { PostgresORM } from '../lib/db/postgres';

@Module({
  controllers: [ChartsController],
  providers: [ChartService, PostgresORM, DynamoORM, S3ORM],
})
export class ChartsModule {}
