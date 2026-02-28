import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/time_deposit'

const migrationsDir = path.join(__dirname, '../db/migrations')

async function migrate() {
  const pool = new Pool({ connectionString })
  const files = fs.readdirSync(migrationsDir).sort()
  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    await pool.query(sql)
    console.log(`Ran ${file}`)
  }
  await pool.end()
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
