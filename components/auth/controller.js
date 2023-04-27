import chalk from 'chalk'
import { CLIENT_ADDRESS } from '../../shared/consts.js'

class Controllers {
  async activateAccount(req, res) {
    try {
      const { link } = req.query
      await userService.activate(link)
      res.redirect(CLIENT_ADDRESS)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }

  async registrationUser(req, res) {
    try {
      const { email, password } = req.body

      const userData = await userService.registrationUser(email, password)

      const MAX_AGE_COOKIE = 30 * 24 * 60 * 60 * 1000 // 30d
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: MAX_AGE_COOKIE,
        httpOnly: true,
      })

      res.json(userData)
    } catch (error) {
      res.send({ error: error.message })
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      res.json(userData)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies
      await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
    } catch (error) {
      console.error(chalk.red(error))
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refreshToken(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      res.json(userData)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

export default new Controllers()
