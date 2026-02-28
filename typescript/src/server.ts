import express from 'express'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import fs from 'fs'
import { parse as parseYaml } from 'yaml'

const app = express()
const port = process.env.PORT ?? 3000

const specPath = path.join(__dirname, '../api/openapi.yaml')
const spec = parseYaml(fs.readFileSync(specPath, 'utf-8'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))

app.get('/time-deposits', (_req, res) => {
  res.json([])
})

app.put('/time-deposits/balance', (_req, res) => {
  res.json({ updated: 0 })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
  console.log(`Swagger UI at http://localhost:${port}/api-docs`)
})
