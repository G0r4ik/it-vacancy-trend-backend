import * as dotenv from 'dotenv'

import cors from 'cors'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import routes from './config/router.js'
import config from './shared/consts.js'
import { errorHandler } from './shared/errorHandler.js'
import { getNumberOfVacancies, canParsing } from './components/list/index.js'

dotenv.config()

const app = express()

app.use(compression({ level: 1 }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: [config.CLIENT_ADDRESS] }))
for (const router of Object.values(routes)) app.use(router)
app.use(errorHandler)

app.listen(config.PORT, () =>
  console.log(`SERVER WORKING. PORT: ${config.PORT}`)
)
setInterval(async () => {
  if ((await canParsing()) && process.env.NODE_ENV === 'production')
    await getNumberOfVacancies()
}, config.INTERVAL_OF_CHECK_CAN_PARSING)
// getNumberOfVacancies() // for test
