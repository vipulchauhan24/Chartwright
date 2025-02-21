import { Module } from '@nestjs/common';
import { HealthCheck } from './health-check';
import { ChartsModule } from '../charts/charts.module';

@Module({
  imports: [ChartsModule],
  controllers: [HealthCheck],
})
export class AppModule {}
