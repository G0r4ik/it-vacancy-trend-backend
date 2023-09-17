import { sendMail } from './mail.js'
import chalk from './chalkColors.js'
import { isProduction } from './consts.js'
import { sendNoticeToTelegram } from '../config/telegram.js'

export class CustomHTTPError extends Error {
  constructor(message, httpStatusCode = 500) {
    super(message)
    this.name = 'CustomHTTPError'
    this.httpStatusCode = httpStatusCode
    this.timestamp = new Date().toISOString()
    Error.captureStackTrace(this, this.constructor)
  }

  toString() {
    return `${this.timestamp}\n${this.name} ${this.httpStatusCode}\n${this.message}\n----\n${this.stack}`
  }
}

export class EmptyParametersError extends CustomHTTPError {
  constructor(message) {
    super(message, 400)
    this.name = 'EmptyParametersError'
  }
}

// eslint-disable-next-line no-unused-vars
export async function errorHandler(errorP, req, res, next) {
  chalk.error('error handler')
  let error = errorP
  if (!(error instanceof CustomHTTPError)) {
    error = new CustomHTTPError(error.message)
  }
  chalk.error(error.toString())
  const { message, httpStatusCode = 500, timestamp, stack } = error

  sendNoticeToTelegram(error.toString())

  if (isProduction) {
    sendMail({
      subject: 'Обработана ошибка',
      text: `${error}, ${timestamp}\n${stack}`,
    })
  }
  return res.status(httpStatusCode).send({
    error: {
      message,
      stack: isProduction ? '' : stack,
    },
  })
}
