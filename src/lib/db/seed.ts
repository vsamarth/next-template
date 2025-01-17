import '@dotenvx/dotenvx/config'
import { reset, seed } from 'drizzle-seed'
import db from '.'
import * as schema from './schema'

async function main() {
  await reset(db, schema)
  await seed(db, {
    users: schema.users,
  }).refine((f) => ({
    users: {
      columns: {
        name: f.fullName(),
        email: f.email(),
      },
    },
  }))
}

void main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => {
    console.log('Database seeded')
  })
