import { Pool } from 'pg'
import { TimeDeposit } from '../../TimeDeposit'
import {
  TimeDepositRepository,
  TimeDepositWithWithdrawals,
} from '../ports/TimeDepositRepository'

export class PostgresTimeDepositRepository implements TimeDepositRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<TimeDeposit[]> {
    const result = await this.pool.query(
      'SELECT id, plan_type, days, balance FROM time_deposits'
    )
    return result.rows.map(
      (row) =>
        new TimeDeposit(
          row.id,
          row.plan_type,
          parseFloat(row.balance),
          row.days
        )
    )
  }

  async findAllWithWithdrawals(): Promise<TimeDepositWithWithdrawals[]> {
    const depositsResult = await this.pool.query(
      'SELECT id, plan_type, days, balance FROM time_deposits'
    )
    const withdrawalsResult = await this.pool.query(
      'SELECT id, time_deposit_id, amount, date FROM withdrawals'
    )

    const withdrawalsByDepositId = withdrawalsResult.rows.reduce<
      Record<number, { id: number; amount: number; date: string }[]>
    >((acc, row) => {
      const depositId = row.time_deposit_id
      if (!acc[depositId]) acc[depositId] = []
      acc[depositId].push({
        id: row.id,
        amount: parseFloat(row.amount),
        date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
      })
      return acc
    }, {})

    return depositsResult.rows.map((row) => ({
      id: row.id,
      planType: row.plan_type,
      balance: parseFloat(row.balance),
      days: row.days,
      withdrawals: withdrawalsByDepositId[row.id] ?? [],
    }))
  }

  async saveAll(deposits: TimeDeposit[]): Promise<void> {
    for (const d of deposits) {
      await this.pool.query(
        'UPDATE time_deposits SET balance = $1, days = $2 WHERE id = $3',
        [d.balance, d.days, d.id]
      )
    }
  }
}
