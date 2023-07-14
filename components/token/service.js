import { userDto } from '../user/index.js'

import { CustomHTTPError } from '../../shared/errorHandler.js'
import { generateTokens, validateRefreshToken } from './helper.js'

class TokenService {
  async refreshToken(refreshToken) {
    if (!refreshToken) throw new CustomHTTPError('Нет refresh токена', 403)
    const userData = await validateRefreshToken(refreshToken)
    if (!userData) throw new CustomHTTPError('Истек рефреш токен', 403)

    const user = userDto(userData)
    const tokens = await generateTokens(user)
    return { ...tokens, user }
  }
}

export default new TokenService()
