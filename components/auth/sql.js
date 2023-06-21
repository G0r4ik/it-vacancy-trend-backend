import { pQuery } from '../../config/database.js'

class Queries {
  async getUserByEmail(email) {
    const user = await pQuery(
      'SELECT * FROM users WHERE user_email = $1',
      email
    )
    return user[0]
  }

  getUserIdByToken(token) {
    return pQuery('SELECT * FROM users WHERE id_user = $1', token)
  }

  createAuth(userId, refreshToken) {
    return pQuery(
      'INSERT INTO auth (id_user, refresh_token) VALUES ($1, $2)',
      userId,
      refreshToken
    )
  }

  async createUser(email, hashPassword, currentDate, activationLink) {
    const user = await pQuery(
      `INSERT INTO users(user_email, user_password, is_active, ip_or_browser, date_of_registration, activation_link) VALUES($1, $2, false, 'null', $3, $4) RETURNING *`,
      email,
      hashPassword,
      currentDate,
      activationLink
    )
    return user[0]
  }

  changeUsersStatus(activationLink) {
    return pQuery(
      'UPDATE users SET is_active = true WHERE activation_link = $1',
      activationLink
    )
  }

  getTokenByToken(token) {
    return pQuery('SELECT * FROM auth WHERE  refresh_token = $1', token)
  }

  getUserById(userId) {
    return pQuery('SELECT * FROM auth WHERE id_user = $1', userId)
  }

  getUserByActivationLink(activationLink) {
    return pQuery(
      'SELECT * FROM users WHERE activation_link = $1',
      activationLink
    )
  }

  deleteRefreshToken(refreshToken) {
    return pQuery('DELETE FROM auth WHERE refresh_token = $1', refreshToken)
  }

  updateRefreshToken(refreshToken) {
    return pQuery('UPDATE auth SET refresh_token = $1', refreshToken)
  }
}

export default new Queries()
