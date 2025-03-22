import { Module } from '@nestjs/common';
import { HealthCheck } from './health-check';
import { ChartsModule } from '../charts/charts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ChartsModule, AuthModule],
  controllers: [HealthCheck],
})
export class AppModule {}
