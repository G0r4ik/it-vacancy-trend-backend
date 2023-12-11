import jwt from 'jsonwebtoken'

export async function generateTokens(payload) {
  const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '30s',
  })
  const refreshToken = await jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  })

  return { refreshToken, accessToken }
}

export async function validateAccessToken(token) {
  try {
    const userData = await jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    return userData
  } catch {
    return null
  }
}

export async function validateRefreshToken(token) {
  try {
    const userData = await jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    return userData
  } catch {
    return null
  }
}
