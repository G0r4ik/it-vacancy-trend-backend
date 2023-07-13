import { validationResult } from 'express-validator'
import { CustomHTTPError } from './errorHandler.js'

export function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg
    throw new CustomHTTPError(errorMessage, 400)
  }
  next()
}
