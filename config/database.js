import * as dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
})

export default pool
