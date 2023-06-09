import * as dotenv from 'dotenv'

import cors from 'cors'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import routes from './config/router.js'
import { getNumberOfVacancies, canParsing } from './components/list/index.js'
import {
  INTERVAL_OF_CHECK_CAN_PARSING,
  CLIENT_ADDRESS,
  PORT,
} from './shared/consts.js'
import { errorHandler } from './shared/errorHandler.js'

dotenv.config()

const app = express()

app.use(compression({ level: 1 }))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: [CLIENT_ADDRESS, process.env.CLIENT_ADDRESS_TEST],
  })
)
for (const router of Object.values(routes)) app.use(router)
app.use(errorHandler)

app.listen(PORT, () => console.log(`SERVER WORKING. PORT: ${PORT}`))
setInterval(async () => {
  if (await canParsing()) getNumberOfVacancies()
}, INTERVAL_OF_CHECK_CAN_PARSING)
// getNumberOfVacancies() // for test
