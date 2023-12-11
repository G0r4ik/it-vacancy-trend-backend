import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import queries from './sql.js'
import { getCurrentDate } from '../../shared/helpers.js'
import config from '../../shared/consts.js'
import { sendMail } from '../../shared/mail.js'
import sc from '../../shared/statusCodes.js'
import { CustomHTTPError } from '../../shared/errorHandler.js'
import { userDto, UserQueries } from '../user/index.js'
import { generateTokens } from '../token/index.js'

class UserService {
  async registrationUser(email, password) {
    const hasUser = await UserQueries.getUserByEmail(email)

    if (hasUser) {
      throw new CustomHTTPError(
        `Пользователь с почтой ${email} существует`,
        sc.Forbidden
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
    const activateUrl = `${config.SERVER_ADDRESS}/activate_account?link=${activationLink}`
    await sendMail({ text: `Your link: ${activateUrl}` })
  }

  async activate(activationLink) {
    const user = await queries.getUserByActivationLink(activationLink)

    if (!user) {
      throw new CustomHTTPError(
        'Пользователя не существует или ссылка не активна'
      )
    }
    await queries.changeUserStatus(activationLink)
  }

  async login(email, password) {
    const user = await UserQueries.getUserByEmail(email)
    if (!user)
      throw new CustomHTTPError('Пользователь не был найден', sc.Forbidden)

    const isActiveAccount = user.is_active
    if (!isActiveAccount)
      throw new CustomHTTPError('Провертье почту', sc.Forbidden)

    const hashPassword = await bcrypt.compare(password, user.user_password)
    if (!hashPassword)
      throw new CustomHTTPError('Неправильный пароль', sc.Forbidden)

    const userData = userDto(user)
    const tokens = await generateTokens(userData)
    return { tokens, user: userData }
  }

  async logout() {
    // queries.deleteRefreshToken(refreshToken)
  }
}

export default new UserService()
