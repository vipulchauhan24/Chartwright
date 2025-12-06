import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './db.schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

const { SUPABASE_DB_URL_IPV4, SUPABASE_DB_URL, NODE_ENV } = process.env;
const url = NODE_ENV === 'development' ? SUPABASE_DB_URL_IPV4 : SUPABASE_DB_URL;

export const drizzleProvider = [
  {
    provide: DRIZZLE_PROVIDER,
    useFactory: async () => {
      const pool = new Pool({ connectionString: `${url}` });
      const db = drizzle(pool, { schema });
      return db;
    },
  },
];
