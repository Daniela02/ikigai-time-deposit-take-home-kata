import { TimeDeposit } from '../TimeDeposit'
import { InterestStrategy } from './InterestStrategy'

const NO_INTEREST_DAYS = 30

function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function monthlyInterestForRate(balance: number, rate: number): number {
  const a = (balance * rate) / 12
  return roundToTwoDecimals(a)
}

/** Basic: 1% interest after 30 days */
export const basicStrategy: InterestStrategy = {
  appliesTo: (d) => d.planType === 'basic' && d.days > NO_INTEREST_DAYS,
  monthlyInterest: (d) => monthlyInterestForRate(d.balance, 0.01),
}

/** Student: 3% interest, no interest after 1 year */
export const studentStrategy: InterestStrategy = {
  appliesTo: (d) =>
    d.planType === 'student' &&
    d.days > NO_INTEREST_DAYS &&
    d.days < 366,
  monthlyInterest: (d) => monthlyInterestForRate(d.balance, 0.03),
}

/** Premium: 5% interest, starts after 45 days */
export const premiumStrategy: InterestStrategy = {
  appliesTo: (d) => d.planType === 'premium' && d.days > 45,
  monthlyInterest: (d) => monthlyInterestForRate(d.balance, 0.05),
}
