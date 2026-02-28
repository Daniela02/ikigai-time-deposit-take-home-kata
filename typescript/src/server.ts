import express from 'express'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import fs from 'fs'
import { parse as parseYaml } from 'yaml'
import { Pool } from 'pg'
import { PostgresTimeDepositRepository } from './db/repositories/PostgresTimeDepositRepository'
import { TimeDepositService } from './application/TimeDepositService'

const app = express()
const port = process.env.PORT ?? 3000
const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/time_deposit'
const pool = new Pool({ connectionString })
const timeDepositService = new TimeDepositService(
  new PostgresTimeDepositRepository(pool)
)

const specPath = path.join(__dirname, '../api/openapi.yaml')
const spec = parseYaml(fs.readFileSync(specPath, 'utf-8'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))

app.get('/time-deposits', async (_req, res) => {
  const timeDeposits = await timeDepositService.listWithWithdrawals()
  res.json(timeDeposits)
})

app.put('/time-deposits/balance', async (_req, res) => {
  const updated = await timeDepositService.updateAllBalances()
  res.json({ updated })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
