import * as dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const { Pool } = pkg

export const pool = new Pool({
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
})

export async function pQuery(query, arguments_) {
  const resp = await pool.query(query, arguments_)
  return resp.rows
}
