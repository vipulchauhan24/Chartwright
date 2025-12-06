import { defineConfig } from 'drizzle-kit';

const { SUPABASE_DB_URL_IPV4, DB_SCHEMA_DEV } = process.env;

export default defineConfig({
  dialect: 'postgresql',
  schema: './apps/server/src/db/db.schema.ts',
  out: './drizzle',
  dbCredentials: { url: `${SUPABASE_DB_URL_IPV4}` },
  schemaFilter: [`${DB_SCHEMA_DEV}`],
  tablesFilter: ['*'],
});
