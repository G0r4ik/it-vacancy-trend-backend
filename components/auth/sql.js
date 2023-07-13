import { pQuery } from '../../config/database.js'

class Queries {
  async getUserByEmail(email) {
    const user = await pQuery('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])
    return user[0]
  }

  async getUserById(id) {
    const user = await pQuery('SELECT * FROM users WHERE user_id = $1', [id])
    return user[0]
  }

  getUserIdByToken(token) {
    return pQuery('SELECT * FROM users WHERE id_user = $1', [token])
  }

  createAuth(userId, refreshToken) {
    return pQuery('INSERT INTO auth (id_user, refresh_token) VALUES ($1, $2)', [
      userId,
      refreshToken,
    ])
  }

  async createUser(email, hashPassword, currentDate, activationLink) {
    const user = await pQuery(
      `INSERT INTO users(user_email, user_password,  date_of_registration,is_active, activation_link) VALUES($1, $2, $3, false, $4) RETURNING *`,
      [email, hashPassword, currentDate, activationLink]
    )
    return user[0]
  }

  changeUsersStatus(activationLink) {
    return pQuery(
      'UPDATE users SET is_active = true WHERE activation_link = $1',
      [activationLink]
    )
  }

  async getUserByActivationLink(activationLink) {
    const res = await pQuery('SELECT * FROM users WHERE activation_link = $1', [
      activationLink,
    ])
    return res[0]
  }

  async getStatusAccount(userId) {
    const res = await pQuery('SELECT is_active FROM users WHERE user_id = $1', [
      userId,
    ])
    return res[0]
  }
}

export default new Queries()
