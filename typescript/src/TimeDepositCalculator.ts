import { TimeDeposit } from './TimeDeposit'
import { InterestStrategy } from './interest/InterestStrategy'
import {
  basicStrategy,
  studentStrategy,
  premiumStrategy,
} from './interest/planStrategies'

const DEFAULT_STRATEGIES = new Map<string, InterestStrategy>([
  ['basic', basicStrategy],
  ['student', studentStrategy],
  ['premium', premiumStrategy],
])

export class TimeDepositCalculator {
  constructor(
    private readonly strategies: Map<string, InterestStrategy> = DEFAULT_STRATEGIES
  ) {}

  public updateBalance(xs: TimeDeposit[]) {
    for (const deposit of xs) {
      let interest = 0
      const strategy = this.strategies.get(deposit.planType)
      if (strategy && strategy.appliesTo(deposit)) {
        interest = strategy.monthlyInterest(deposit)
      }

      deposit.balance += interest
    }
  }
}
