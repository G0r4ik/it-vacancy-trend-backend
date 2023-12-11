import { userDto } from '../user/index.js'

import { CustomHTTPError } from '../../shared/errorHandler.js'
import { generateTokens, validateRefreshToken } from './helper.js'
import sc from '../../shared/statusCodes.js'

class TokenService {
  async refreshToken(refreshToken) {
    if (!refreshToken)
      throw new CustomHTTPError('Нет refresh токена', sc.Forbidden)
    const userData = await validateRefreshToken(refreshToken)
    if (!userData) throw new CustomHTTPError('Истек рефреш токен', sc.Forbidden)

    const user = userDto(userData)
    const tokens = await generateTokens(user)
    return { ...tokens, user }
  }
}

export default new TokenService()
