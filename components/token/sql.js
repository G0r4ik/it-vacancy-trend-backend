import { pQuery } from '../../config/database.js'

class TokenQueries {
  getTokenByToken(token) {
    return pQuery('SELECT * FROM auth WHERE  refresh_token = $1', [token])
  }

  deleteRefreshToken(refreshToken) {
    return pQuery('DELETE FROM auth WHERE refresh_token = $1', [refreshToken])
  }

  updateRefreshToken(refreshToken) {
    return pQuery('UPDATE auth SET refresh_token = $1', [refreshToken])
  }
}

export default new TokenQueries()
