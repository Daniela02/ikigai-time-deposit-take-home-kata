import { TimeDeposit } from '../TimeDeposit'
import { TimeDepositCalculator } from '../TimeDepositCalculator'

test('Should update balance basic plan', () => {
  const plans: TimeDeposit[] = [new TimeDeposit(1, 'basic', 1234567.0, 45)]
  const calc = new TimeDepositCalculator()
  calc.updateBalance(plans)

  expect(plans.length).toBe(1)
  expect(plans[0].balance).toBe(1235595.81)
  expect(plans[0].days).toBe(45)
  expect(plans[0].planType).toBe('basic')
  expect(plans[0].id).toBe(1)
})

test('Should update balance premium plan', () => {
  const plans: TimeDeposit[] = [new TimeDeposit(1, 'premium', 1234567.0, 55)]
  const calc = new TimeDepositCalculator()
  calc.updateBalance(plans)

  expect(plans.length).toBe(1)
  expect(plans[0].balance).toBe(1239711.03)
  expect(plans[0].days).toBe(55)
  expect(plans[0].planType).toBe('premium')
  expect(plans[0].id).toBe(1)
})

test('Should update balance student plan', () => {
  const plans: TimeDeposit[] = [new TimeDeposit(1, 'student', 1234567.0, 45)]
  const calc = new TimeDepositCalculator()
  calc.updateBalance(plans)

  expect(plans.length).toBe(1)
  expect(plans[0].balance).toBe(1237653.42)
  expect(plans[0].days).toBe(45)
  expect(plans[0].planType).toBe('student')
  expect(plans[0].id).toBe(1)
})