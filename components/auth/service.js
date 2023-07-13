import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import queries from './sql.js'
import { getCurrentDate } from '../../shared/helpers.js'
import { SERVER_ADDRESS } from '../../shared/consts.js'
import { sendMail } from '../../shared/mail.js'
import { CustomHTTPError } from '../../shared/errorHandler.js'
import userDto from './dto.js'
import { tokenService } from '../token/index.js'

class UserService {
  async registrationUser(email, password) {
    const hasUser = await queries.getUserByEmail(email)

    if (hasUser) {
      throw new CustomHTTPError(
        `Пользователь с почтой ${email} существует`,
        403
      )
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    await queries.createUser(
      email,
      hashPassword,
      getCurrentDate(),
      activationLink
    )
    const activateUrl = `${SERVER_ADDRESS}/activate_account?link=${activationLink}`
    await sendMail({ text: `Your link: ${activateUrl}` })
  }

  async activate(activationLink) {
    const user = await queries.getUserByActivationLink(activationLink)

    if (!user) {
      throw new CustomHTTPError(
        'Пользователя не существует или ссылка не активна'
      )
    }
    await queries.changeUsersStatus(activationLink)
  }

  async login(email, password, next) {
    const user = await queries.getUserByEmail(email)
    if (!user) throw new CustomHTTPError('Пользователь не был найден', 403)
    const hashPassword = await bcrypt.compare(password, user.user_password)
    if (!hashPassword) throw new CustomHTTPError('Неправильный пароль', 403)

    const isActiveAccount = await queries.getStatusAccount(user.user_id)
    if (!isActiveAccount) throw new CustomHTTPError('Провертье почту', 403)

    const userData = userDto(user)
    const tokens = await tokenService.generateTokens(userData)
    return { tokens, user: userData }
  }

  async logout(refreshToken) {
    // queries.deleteRefreshToken(refreshToken)
  }
}

export default new UserService()
