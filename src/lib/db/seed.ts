import '@dotenvx/dotenvx/config'
import { reset, seed } from 'drizzle-seed'
import db from '.'
import * as schema from './schema'
import { hashSync } from '@node-rs/argon2'

async function main() {
  await reset(db, schema)
  await seed(db, { users: schema.users }, { seed: 42 }).refine((f) => ({
    users: {
      columns: {
        name: f.fullName(),
        email: f.email(),
        passwordHash: f.valuesFromArray({
          values: ['secret'].map((password) => hashSync(password)),
        }),
        emailVerified: f.weightedRandom([
          {
            weight: 0.8,
            value: f.default({ defaultValue: null }),
          },
          {
            weight: 0.2,
            value: f.date({ maxDate: new Date() }),
          },
        ]),
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
