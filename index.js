import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import routes from './config/router.js'

import { getNumberOfVacancies } from './components/list/index.js'
import {
  CLIENT_ADDRESS,
  INTERVAL_OF_GET_VACANCEIS,
  PORT,
} from './shared/consts.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: [CLIENT_ADDRESS] }))
for (const router of Object.values(routes)) app.use(router)

app.listen(PORT, () => {
  console.log(`SERVER WORKING. PORT: ${PORT}`)
})
setInterval(() => {
  getNumberOfVacancies()
}, INTERVAL_OF_GET_VACANCEIS)
// getNumberOfVacancies() // for test
