import { TimeDepositCalculator } from '../TimeDepositCalculator'
import {
  TimeDepositRepository,
  TimeDepositWithWithdrawals,
} from '../db/ports/TimeDepositRepository'

export class TimeDepositService {
  constructor(
    private readonly repository: TimeDepositRepository,
    private readonly calculator: TimeDepositCalculator = new TimeDepositCalculator()
  ) {}

  async updateAllBalances(): Promise<number> {
    const deposits = await this.repository.findAll()
    this.calculator.updateBalance(deposits)
    await this.repository.saveAll(deposits)
    
    return deposits.length
  }

  async listWithWithdrawals(): Promise<TimeDepositWithWithdrawals[]> {
    return this.repository.findAllWithWithdrawals()
  }
}
