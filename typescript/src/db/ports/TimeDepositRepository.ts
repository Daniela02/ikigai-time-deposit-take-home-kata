import { TimeDeposit } from '../../TimeDeposit'

export interface Withdrawal {
  id: number
  amount: number
  date: string
}

export interface TimeDepositWithWithdrawals {
  id: number
  planType: string
  balance: number
  days: number
  withdrawals: Withdrawal[]
}

export interface TimeDepositRepository {
  findAll(): Promise<TimeDeposit[]>
  findAllWithWithdrawals(): Promise<TimeDepositWithWithdrawals[]>
  saveAll(deposits: TimeDeposit[]): Promise<void>
}
