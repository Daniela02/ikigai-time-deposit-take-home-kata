import { runMigrations } from '../db/runMigrations'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/time_deposit'

runMigrations(connectionString)
  .then(() => console.log('Migrations complete'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
