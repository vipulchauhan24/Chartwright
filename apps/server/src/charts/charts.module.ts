import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartService } from './charts.service';
import { S3ORM } from '../lib/s3/orm/s3ORM';
import { DBModule } from '../db/db.module';
import { DBService } from '../db/db.service';
import { AuthGaurd } from '../auth/auth.gaurd';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [DBModule, AuthModule],
  controllers: [ChartsController],
  providers: [ChartService, S3ORM, DBService, AuthGaurd, AuthService],
})
export class ChartsModule {}
