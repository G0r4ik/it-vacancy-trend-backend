import { validationResult } from 'express-validator'
import { CustomHTTPError, errorHandler } from './errorHandler.js'

export function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg
    errorHandler(new CustomHTTPError(errorMessage, 400), req, res, next)
  }
  next()
}
