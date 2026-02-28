import { TimeDeposit } from '../TimeDeposit'
import { TimeDepositRepository } from '../db/ports/TimeDepositRepository'
import { UpdateAllBalances } from '../application/useCases/UpdateAllBalances'

describe('UpdateAllBalances', () => {
  it('loads deposits, updates balances via calculator, and persists', async () => {
    const deposits = [
      new TimeDeposit(1, 'basic', 1000, 45),
      new TimeDeposit(2, 'student', 2000, 100),
    ]
    let saved: TimeDeposit[] = []

    const fakeRepo: TimeDepositRepository = {
      findAll: async () => [...deposits],
      findAllWithWithdrawals: async () => [],
      saveAll: async (d) => {
        saved = [...d]
      },
    }

    const useCase = new UpdateAllBalances(fakeRepo)
    const count = await useCase.execute()

    expect(count).toBe(2)
    expect(saved).toHaveLength(2)
    expect(saved[0].balance).toBeCloseTo(1000.83, 2)
    expect(saved[1].balance).toBeCloseTo(2005, 2)
  })
})
