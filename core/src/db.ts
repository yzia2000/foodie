import { Pool, PoolConfig } from 'pg';

const connectionString: string =
  process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@db:5432/database';

let options: PoolConfig;
if (process.env.NODE_ENV === 'production') {
  options = {
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  options = {
    connectionString: connectionString,
  };
}

export default new Pool(options);
