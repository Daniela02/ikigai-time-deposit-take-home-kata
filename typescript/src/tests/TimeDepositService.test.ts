import { TimeDeposit } from '../TimeDeposit'
import { TimeDepositRepository } from '../db/ports/TimeDepositRepository'
import { TimeDepositService } from '../application/TimeDepositService'

describe('TimeDepositService', () => {
  describe('updateAllBalances', () => {
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

      const service = new TimeDepositService(fakeRepo)
      const count = await service.updateAllBalances()

      expect(count).toBe(2)
      expect(saved).toHaveLength(2)
      expect(saved[0].balance).toBeCloseTo(1000.83, 2)
      expect(saved[1].balance).toBeCloseTo(2005, 2)
    })
  })

  describe('listWithWithdrawals', () => {
    it('returns all time deposits with their withdrawals', async () => {
      const expected = [
        {
          id: 1,
          planType: 'basic',
          balance: 1000,
          days: 45,
          withdrawals: [{ id: 1, amount: 100, date: '2024-01-15' }],
        },
      ]

      const fakeRepo: TimeDepositRepository = {
        findAll: async () => [],
        findAllWithWithdrawals: async () => expected,
        saveAll: async () => {},
      }

      const service = new TimeDepositService(fakeRepo)
      const result = await service.listWithWithdrawals()

      expect(result).toEqual(expected)
      expect(result[0].withdrawals).toHaveLength(1)
      expect(result[0].withdrawals[0]).toEqual({
        id: 1,
        amount: 100,
        date: '2024-01-15',
      })
    })
  })
})
