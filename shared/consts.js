import * as dotenv from 'dotenv'

dotenv.config()

export const isProduction = process.env.NODE_ENV === 'production'

const clientURL = process.env.CLIENT_ADDRESS
const serverPort = process.env.LOCAL_SERVER_PORT
const clientPort = process.env.LOCAL_WEBPACK_PORT

const config = {
  CLIENT_ADDRESS_LOCAL: `http://localhost:${clientPort}`,
  CLIENT_ADDRESS: isProduction ? clientURL : `http://localhost:${clientPort}`,
  CLIENT_ADDRESS_TEST: process.env.CLIENT_ADDRESS_TEST,

  PORT: process.env.PORT || serverPort,

  INTERVAL_OF_CHECK_CAN_PARSING: 1000 * 45 * 60, // 45 минут
  MIN_VALUE_CHECKING_DIFFERENCES: 30,
  NUMBER_OF_FAILED_ATTEMPTS: 10,
  HOURS_OF_START_PARSING: 15,
  MAX_AGE_COOKIE: 30 * 24 * 60 * 60 * 1000, // 30d
  MAX_AGE_REFRESH_TOKEN: '30d',
  MAX_AGE_ACCESS_TOKEN: '30m',

  // Вынести это в базу: FIXME
  fixedOrNotFound: {
    HeadHunter: ['исправлен', 'не найдено'],
  },

  waitingBetweenRequests: {
    LinkedIn: 3000,
  },
}

export default config
