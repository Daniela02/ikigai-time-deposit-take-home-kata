import { Pool } from 'pg'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/time_deposit'

async function seed() {
  const pool = new Pool({ connectionString })

  await pool.query('TRUNCATE time_deposits RESTART IDENTITY CASCADE')

  await pool.query(
    `INSERT INTO time_deposits (plan_type, days, balance) VALUES
     ('basic', 45, 1000.00),
     ('student', 100, 5000.00),
     ('premium', 60, 2000.00)`
  )

  await pool.query(
    `INSERT INTO withdrawals (time_deposit_id, amount, date) VALUES
     (1, 100.00, '2024-01-15'),
     (1, 50.00, '2024-02-01')`
  )

  await pool.end()
  console.log('Seed data inserted')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
