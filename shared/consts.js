import * as dotenv from 'dotenv'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const clientAddress = process.env.CLIENT_ADDRESS
const serverAddress = process.env.SERVER_ADDRESS
const serverPort = process.env.LOCAL_SERVER_PORT
const clientPort = process.env.LOCAL_WEBPACK_PORT

const CLIENT_ADDRESS_LOCAL = `http://localhost:${clientPort}`
const SERVER_ADDRESS_LOCAL = `http://localhost:${serverPort}`
const CLIENT_ADDRESS = isProduction ? clientAddress : CLIENT_ADDRESS_LOCAL
const SERVER_ADDRESS = isProduction ? serverAddress : SERVER_ADDRESS_LOCAL

const PORT = process.env.PORT || serverPort
const INTERVAL_OF_GET_VACANCEIS = 24 * 60 * 60 * 1000 // 1 day

export {
  CLIENT_ADDRESS_LOCAL,
  SERVER_ADDRESS_LOCAL,
  CLIENT_ADDRESS,
  SERVER_ADDRESS,
  PORT,
  INTERVAL_OF_GET_VACANCEIS,
}
