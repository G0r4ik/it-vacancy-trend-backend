import * as dotenv from 'dotenv'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const clientURL = process.env.CLIENT_ADDRESS
const serverURL = process.env.SERVER_ADDRESS
const serverPort = process.env.LOCAL_SERVER_PORT
const clientPort = process.env.LOCAL_WEBPACK_PORT

export const CLIENT_ADDRESS_LOCAL = `http://localhost:${clientPort}`
export const SERVER_ADDRESS_LOCAL = `http://localhost:${serverPort}`
export const CLIENT_ADDRESS = isProduction ? clientURL : CLIENT_ADDRESS_LOCAL
export const SERVER_ADDRESS = isProduction ? serverURL : SERVER_ADDRESS_LOCAL

export const PORT = process.env.PORT || serverPort

export const INTERVAL_OF_CHECK_CAN_PARSING = 1000 * 45 * 60 // 45 минут
export const MIN_VALUE_CHECKING_DIFFERENCES = 30
export const NUMBER_OF_FAILED_ATTEMPTS = 10
export const HOURS_OF_START_PARSING = 15

export const HH_QUERY_SEARCH = `https://spb.hh.ru/search/vacancy?no_magic=true&area=113&items_on_page=1&text=`
export const HH_HTML_NODE_CONTAINNING_COUNT = 'bloko-header-3'

export const MAX_AGE_COOKIE = 30 * 24 * 60 * 60 * 1000 // 30d
