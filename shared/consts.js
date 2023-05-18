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
export const HOURS_OF_START_PARSING = 15
export const INTERVAL_OF_CHECK_CAN_PARSING = 1000 * 45 * 60 // 45 минут
export const PORT = process.env.PORT || serverPort
