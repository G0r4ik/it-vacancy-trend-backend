import { CustomHTTPError, errorHandler } from '../../shared/errorHandler.js'
import { validateAccessToken } from '../token/index.js' // !!!

export default async function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) throw new CustomHTTPError('Токен не получен', 401)
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) throw new CustomHTTPError('Токен не получен', 401)
    const userData = await validateAccessToken(accessToken)
    if (!userData) throw new CustomHTTPError('Токен устарел', 401)
    req.user = userData
    next()
  } catch (error) {
    errorHandler(error, req, res, next)
  }
}
