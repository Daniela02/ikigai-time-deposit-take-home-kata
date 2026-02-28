import { TimeDepositCalculator } from '../TimeDepositCalculator'
import {
  TimeDepositRepository,
  TimeDepositWithWithdrawals,
} from '../db/ports/TimeDepositRepository'

// Assuming a month has 30 days
const MONTHLY_INTEREST_DAYS = 30

export class TimeDepositService {
  constructor(
    private readonly repository: TimeDepositRepository,
    private readonly calculator: TimeDepositCalculator = new TimeDepositCalculator()
  ) {}

  async updateAllBalances(): Promise<number> {
    const deposits = await this.repository.findAll()
    this.calculator.updateBalance(deposits)

    for (const d of deposits) { 
      d.days += MONTHLY_INTEREST_DAYS
    }

    await this.repository.saveAll(deposits)
    
    return deposits.length
  }

  async listWithWithdrawals(): Promise<TimeDepositWithWithdrawals[]> {
    return this.repository.findAllWithWithdrawals()
  }
}
