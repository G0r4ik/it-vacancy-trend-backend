import { sendMail } from './mail.js'
import chalk from './chalkColors.js'
import { isProduction } from './consts.js'

export class CustomHTTPError extends Error {
  constructor(message, httpStatusCode = 500) {
    super(message)
    this.name = 'CustomHTTPError'
    this.httpStatusCode = httpStatusCode
    this.timestamp = new Date().toISOString()
    Error.captureStackTrace(this, this.constructor)
  }

  toString() {
    return `${this.timestamp}${this.httpStatusCode}${this.name}\n${this.stack}`
  }
}

export class EmptyParametersError extends CustomHTTPError {
  constructor(message) {
    super(message, 400)
    this.name = 'EmptyParametersError'
  }
}

export function errorHandler(error, req, res, next) {
  console.log(chalk.error('error handler'))
  // FIX
  if (!(error instanceof CustomHTTPError)) {
    error = new CustomHTTPError(error.message)
  }
  console.log(chalk.error(error.toString()))
  const { message, httpStatusCode = 500, timestamp, stack } = error
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
