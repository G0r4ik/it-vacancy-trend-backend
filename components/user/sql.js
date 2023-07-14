import { pQuery } from '../../config/database.js'

class UserQueries {
  async getUserById(id) {
    const user = await pQuery('SELECT * FROM users WHERE user_id = $1', [id])
    return user[0]
  }

  async getUserByEmail(email) {
    const user = await pQuery('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])
    return user[0]
  }
}

export default new UserQueries()
