import * as dotenv from 'dotenv'

import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './config/router.js'
import config, { isProduction } from './shared/consts.js'
import { errorHandler } from './shared/errorHandler.js'
import { getNumberOfVacancies, canParsing } from './components/list/index.js'
// import { parsingJobBoards } from './components/jobboardRanked/parseJobBoards.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: [config.CLIENT_ADDRESS, config.CLIENT_ADDRESS_TEST],
  })
)
for (const router of Object.values(routes)) app.use(router)
app.use(errorHandler)

app.listen(config.PORT, () =>
  console.log(`SERVER WORKING. PORT: ${config.PORT}`)
)

setInterval(async () => {
  if ((await canParsing()) && isProduction) await getNumberOfVacancies()
}, config.INTERVAL_OF_CHECK_CAN_PARSING)
await canParsing()
// getNumberOfVacancies() // for test
// parsingJobBoards()
