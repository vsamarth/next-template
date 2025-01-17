import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
}

const pool =
  globalForDb.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV != 'production') {
  globalForDb.pool = pool
}

const db = drizzle({ client: pool, schema })
export default db
