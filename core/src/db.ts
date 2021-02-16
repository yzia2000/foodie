import { Pool } from 'pg';

const connectionString: string =
  (process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@db:5432/database') +
  (process.env.NODE_ENV === 'production' ? '?sslmode=require' : '');

export default new Pool({
  connectionString: connectionString,
});
