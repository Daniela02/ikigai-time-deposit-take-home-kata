import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { Pool } from 'pg'
import { runMigrations } from '../../db/runMigrations'

describe('Database integration', () => {
  jest.setTimeout(60_000)

  let container: Awaited<ReturnType<PostgreSqlContainer['start']>>
  let connectionString: string

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16').start()
    connectionString = container.getConnectionUri()
    await runMigrations(connectionString)
  })

  afterAll(async () => {
    await container?.stop()
  })

  it('connects to Postgres and reads from time_deposits table', async () => {
    const pool = new Pool({ connectionString })
    await pool.query(
      'INSERT INTO time_deposits (plan_type, days, balance) VALUES ($1, $2, $3)',
      ['basic', 45, 1000.0]
    )
    const result = await pool.query('SELECT * FROM time_deposits')
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]).toMatchObject({
      plan_type: 'basic',
      days: 45,
      balance: '1000.00',
    })
    await pool.end()
  })
})
