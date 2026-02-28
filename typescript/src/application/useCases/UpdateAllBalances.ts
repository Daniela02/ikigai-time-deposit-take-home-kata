import { TimeDepositCalculator } from '../../TimeDepositCalculator'
import { TimeDepositRepository } from '../../db/ports/TimeDepositRepository'

export class UpdateAllBalances {
  constructor(
    private readonly repository: TimeDepositRepository,
    private readonly calculator: TimeDepositCalculator = new TimeDepositCalculator()
  ) {}

  async execute(): Promise<number> {
    console.log('Updating all balances')
    const deposits = await this.repository.findAll()

    console.log(`Found Deposits: ${deposits.length}`)
    this.calculator.updateBalance(deposits)

    await this.repository.saveAll(deposits)
    console.log(`Updated Deposits: ${deposits.length}`)
    
    return deposits.length
  }
}
