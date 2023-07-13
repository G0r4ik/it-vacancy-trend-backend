import UserService from './service.js'
import { CLIENT_ADDRESS, MAX_AGE_COOKIE } from '../../shared/consts.js'
import { checkParameters } from '../../shared/helpers.js'
import { validationResult } from 'express-validator'
import { CustomHTTPError } from '../../shared/errorHandler.js'

class Controllers {
  async activateAccount(req, res, next) {
    try {
      const { link } = req.query
      await UserService.activate(link)
      res.redirect(`${CLIENT_ADDRESS}/auth`)
    } catch (error) {
      next(error)
    }
  }

  async registrationUser(req, res, next) {
    try {
      const { email, password } = req.body
      checkParameters('registrationUser', { email, password })

      await UserService.registrationUser(email, password)
      res.json({ message: 'Check your email' })
    } catch (error) {
      next(error)
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body
      checkParameters('loginUser', { email, password })
      const { user, tokens } = await UserService.login(email, password)
      const { accessToken, refreshToken } = tokens

      const cookieOptions = { maxAge: MAX_AGE_COOKIE, httpOnly: true }
      res.cookie('refreshToken', refreshToken, cookieOptions)

      res.json({ user, accessToken })
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      await UserService.logout(refreshToken)
      res.clearCookie('refreshToken')
      res.json({ message: 'Успех' })
    } catch (error) {
      next(error)
    }
  }
}

export default new Controllers()
