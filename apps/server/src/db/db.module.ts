import { Module } from '@nestjs/common/';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DBService } from './db.service';

const { SUPABASE_DB_URL_IPV4, SUPABASE_DB_URL, NODE_ENV } = process.env;

const url = NODE_ENV === 'development' ? SUPABASE_DB_URL_IPV4 : SUPABASE_DB_URL;

const db = drizzle(`${url}`);

@Module({
  providers: [{ provide: 'DATABASE_CONNECTION', useValue: db }, DBService],
  exports: ['DATABASE_CONNECTION', DBService],
})
export class DBModule {}
