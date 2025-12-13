import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DBModule } from '../db/db.module';
import { AuthGaurd } from './auth.gaurd';

@Module({
  imports: [DBModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGaurd],
  exports: [AuthGaurd],
})
export class AuthModule {}
