import { TimeDeposit } from '../TimeDeposit'

/**
 * Strategy for computing monthly interest on a time deposit.
 * Extensible for new plan types without modifying the calculator.
 */
export interface InterestStrategy {
  appliesTo(deposit: TimeDeposit): boolean
  monthlyInterest(deposit: TimeDeposit): number
}
