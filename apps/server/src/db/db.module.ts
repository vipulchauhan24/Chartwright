import { Module } from '@nestjs/common/';
import { DBService } from './db.service';
import { DRIZZLE_PROVIDER, drizzleProvider } from './db.provider';

@Module({
  providers: [...drizzleProvider, DBService],
  exports: [DRIZZLE_PROVIDER, DBService],
})
export class DBModule {}
