import chalk from 'chalk'
import { MAX_AGE_COOKIE } from '../../shared/consts.js'
import TokenService from './service.js'

class TokenController {
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await TokenService.refreshToken(refreshToken)
      const cookieOptions = { maxAge: MAX_AGE_COOKIE, httpOnly: true }
      res.cookie('refreshToken', userData.refreshToken, cookieOptions)
      res.json(userData)
    } catch (error) {
      next(error)
    }
  }
}

export default new TokenController()
