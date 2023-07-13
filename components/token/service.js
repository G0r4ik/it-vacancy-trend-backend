import jwt from 'jsonwebtoken'
import queries from './sql.js'
import { AuthQueries, UserDto } from '../auth/index.js'

import { CustomHTTPError } from '../../shared/errorHandler.js'

class TokenService {
  async generateTokens(payload) {
    const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30s',
    })
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '5m',
      }
    )

    return { refreshToken, accessToken }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await AuthQueries.getUserById(userId)
    if (tokenData.length > 0) {
      queries.updateRefreshToken(refreshToken)
    } else {
      AuthQueries.createAuth(userId, refreshToken)
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch {
      return null
    }
  }

  async validateRefreshToken(token) {
    try {
      const userData = await jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch {
      return null
    }
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) throw new CustomHTTPError('Нет refresh токена', 403)
    const userData = await this.validateRefreshToken(refreshToken)

    if (!userData) throw new CustomHTTPError('Истек рефреш токен', 403)
    const user = await AuthQueries.getUserById(userData.userId)
    const userDto = UserDto(user)

    const tokens = await this.generateTokens({ ...userDto })
    return { ...tokens, user: userDto }
  }
}

export default new TokenService()
