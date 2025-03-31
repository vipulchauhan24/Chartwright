import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';

const { SUPABASE_DB_URL_IPV4 } = process.env;

const db = drizzle(`${SUPABASE_DB_URL_IPV4}`);

@Module({
  providers: [{ provide: 'DATABASE_CONNECTION', useValue: db }],
  exports: ['DATABASE_CONNECTION'],
})
export class DBModule {}
