import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const migrationsDir = path.join(__dirname, 'migrations')

export async function runMigrations(connectionString: string): Promise<void> {
  const pool = new Pool({ connectionString })
  const files = fs.readdirSync(migrationsDir).sort()
  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    await pool.query(sql)
  }
  await pool.end()
}
