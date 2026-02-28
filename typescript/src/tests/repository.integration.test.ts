import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { Pool } from 'pg'
import { TimeDeposit } from '../TimeDeposit'
import { PostgresTimeDepositRepository } from '../db/repositories/PostgresTimeDepositRepository'
import { runMigrations } from '../../db/runMigrations'

describe('PostgresTimeDepositRepository', () => {
  jest.setTimeout(60_000)

  let container: Awaited<ReturnType<PostgreSqlContainer['start']>>
  let pool: Pool
  let repository: PostgresTimeDepositRepository

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16').start()
    const connectionString = container.getConnectionUri()
    await runMigrations(connectionString)
    pool = new Pool({ connectionString })
    repository = new PostgresTimeDepositRepository(pool)
  })

  afterAll(async () => {
    await pool?.end()
    await container?.stop()
  })

  beforeEach(async () => {
    await pool.query('DELETE FROM withdrawals')
    await pool.query('TRUNCATE time_deposits RESTART IDENTITY CASCADE')
  })

  it('findAll returns empty when no deposits exist', async () => {
    const result = await repository.findAll()
    expect(result).toEqual([])
  })

  it('findAll returns all deposits', async () => {
    await pool.query(
      'INSERT INTO time_deposits (plan_type, days, balance) VALUES ($1, $2, $3), ($4, $5, $6)',
      ['basic', 45, 1000.0, 'student', 100, 5000.0]
    )

    const result = await repository.findAll()

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(new TimeDeposit(1, 'basic', 1000, 45))
    expect(result[1]).toEqual(new TimeDeposit(2, 'student', 5000, 100))
  })

  it('saveAll updates balances', async () => {
    await pool.query(
      'INSERT INTO time_deposits (plan_type, days, balance) VALUES ($1, $2, $3)',
      ['basic', 45, 1000.0]
    )

    const deposits = [new TimeDeposit(1, 'basic', 1100.0, 45)]
    await repository.saveAll(deposits)

    const result = await repository.findAll()
    expect(result[0].balance).toBe(1100)
  })

  it('findAllWithWithdrawals returns deposits with their withdrawals', async () => {
    await pool.query(
      'INSERT INTO time_deposits (plan_type, days, balance) VALUES ($1, $2, $3), ($4, $5, $6)',
      ['basic', 45, 1000.0, 'premium', 100, 5000.0]
    )
    await pool.query(
      'INSERT INTO withdrawals (time_deposit_id, amount, date) VALUES ($1, $2, $3), ($4, $5, $6)',
      [1, 100.0, '2024-01-15', 1, 50.0, '2024-02-01']
    )

    const result = await repository.findAllWithWithdrawals()

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      id: 1,
      planType: 'basic',
      balance: 1000,
      days: 45,
    })
    expect(result[0].withdrawals).toHaveLength(2)
    expect(result[0].withdrawals[0]).toMatchObject({ id: 1, amount: 100 })
    expect(result[0].withdrawals[1]).toMatchObject({ id: 2, amount: 50 })
    expect(result[1].withdrawals).toHaveLength(0)
  })
})
