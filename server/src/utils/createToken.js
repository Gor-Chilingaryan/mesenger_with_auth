/**
 * Module: createToken.js
 * Description: JWT access and refresh token generation for authenticated sessions.
 * Role in request lifecycle: Called from auth services after login/registration/password reset/refresh — not invoked directly by HTTP layer.
 */
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET
const ACCESS_EXPIRATION = process.env.ACCESS_EXPIRATION
const REFRESH_EXPIRATION = process.env.REFRESH_EXPIRATION

/**
 * Signs a short-lived access token and a longer-lived refresh token embedding the user id.
 * @param {string|import('mongoose').Types.ObjectId} userId - Subject identifier stored in JWT payload as `userId` (used by auth middleware after verify).
 * @returns {{ accessToken: string, refreshToken: string }} Pair of signed JWT strings.
 * @throws {Error} From `jwt.sign` if secrets or expiration options are invalid/missing at runtime.
 */
export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRATION
  })

  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRATION
  })

  return {
    accessToken,
    refreshToken
  }
}

export default {
  generateTokens
}
