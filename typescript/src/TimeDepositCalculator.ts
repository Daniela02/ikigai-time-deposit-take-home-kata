import { TimeDeposit } from './TimeDeposit'
import { InterestStrategy } from './interest/InterestStrategy'
import {
  basicStrategy,
  studentStrategy,
  premiumStrategy,
} from './interest/planStrategies'

const DEFAULT_STRATEGIES: InterestStrategy[] = [
  basicStrategy,
  studentStrategy,
  premiumStrategy,
]

export class TimeDepositCalculator {
  constructor(
    private readonly strategies: InterestStrategy[] = DEFAULT_STRATEGIES
  ) {}

  public updateBalance(xs: TimeDeposit[]) {
    for (const deposit of xs) {
      let interest = 0
      const strategy = this.strategies.find(strategy => strategy.appliesTo(deposit))
      if (strategy) {
        interest = strategy.monthlyInterest(deposit)
      }
      
      deposit.balance += interest
    }
  }
}
