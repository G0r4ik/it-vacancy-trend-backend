import { CustomHTTPError, errorHandler } from '../../shared/errorHandler.js'
import { validateAccessToken } from '../token/index.js' // !!!
import sc from '../../shared/statusCodes.js'

export default async function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      throw new CustomHTTPError('Токен не получен', sc.Unauthorized)
    }
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      throw new CustomHTTPError('Токен не получен', sc.Unauthorized)
    }
    const userData = await validateAccessToken(accessToken)
    if (!userData) throw new CustomHTTPError('Токен устарел', sc.Unauthorized)
    req.user = userData
    next()
  } catch (error) {
    errorHandler(error, req, res, next)
  }
}
