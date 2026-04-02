/**
 * Module: auth.controller.js
 * Description: HTTP handlers for registration, login, password recovery/reset, JWT refresh, and logout.
 * Role in request lifecycle: Controller layer — parses cookies/body, invokes auth services, maps results and errors to HTTP status codes and JSON.
 */
import { createUserService, loginUserService, forgotPasswordService, newPasswordService, refreshServices } from '../services/auth.services.js'

const isProd = process.env.NODE_ENV === 'production'

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict',
  path: '/',
}

/**
 * Authenticates credentials and issues tokens as HttpOnly cookies plus access token in JSON for the SPA.
 * @param {import('express').Request} req - Body: `{ email, password }`.
 * @param {import('express').Response} res - Sets `accessToken` and `refreshToken` cookies; JSON `{ user, accessToken }` on success.
 * @returns {Promise<void>}
 * @throws {void} Errors are sent as HTTP responses, not rethrown.
 */
export const loginUserController = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUserService(req.body)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({ user, accessToken })
  } catch (err) {
    // INVALID_CREDENTIALS from service — 401 Unauthorized (wrong email/password or unknown user).
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: err.message })
    }

    // Any other failure (e.g. DB error, unexpected service throw) — 500 Internal Server Error.
    res.status(500).json({ message: err.message })
  }
}

/**
 * Creates a user account and sets the same cookie contract as login.
 * @param {import('express').Request} req - Body: `{ firstName, lastName, email, password }`.
 * @param {import('express').Response} res - Sets auth cookies; JSON `{ user, accessToken }` with 201 Created.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const registerController = async (req, res) => {
  try {

    const { user, accessToken, refreshToken } = await createUserService(req.body)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(201).json({ user, accessToken })
  } catch (err) {
    // EMAIL_EXISTS — 409 Conflict (resource already exists with same unique key).
    if (err.code === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: err.message })
    }

    res.status(500).json({ message: err.message })
  }
}

/**
 * Confirms an account exists for the given email (pre-step before client navigates to reset UI).
 * @param {import('express').Request} req - Body: `{ email }`.
 * @param {import('express').Response} res - 200 with user document from service on success.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const forgotPasswordController = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email)

    res.status(200).json(result)
  } catch (err) {
    // Service throws on missing email or user not found — still surfaced as 500 here (client may treat generically).
    return res.status(500).json({ message: err.message })
  }
}

/**
 * Persists a new password and rotates tokens (user is effectively re-authenticated).
 * @param {import('express').Request} req - Body: `{ email, password }` (new password).
 * @param {import('express').Response} res - Sets cookies; JSON includes message, `user`, and `accessToken`.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const newPasswordController = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await newPasswordService(req.body.email, req.body.password)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({
      message: 'Password updated successfully',
      user,
      accessToken,
    })
  } catch (err) {
    // Validation or not-found errors from service — returned as 500 in this handler (no distinct 404 mapping).
    return res.status(500).json({ message: err.message })
  }
}

/**
 * Exchanges a valid refresh token cookie for a new access/refresh pair.
 * @param {import('express').Request} req - Cookies: `refreshToken` (HttpOnly).
 * @param {import('express').Response} res - Updates auth cookies; JSON `{ message, accessToken }`.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const refreshTokenController = async (req, res) => {
  try {

    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) throw new Error('No refresh token found')

    const { accessToken, refreshToken: newRefreshToken } = await refreshServices(refreshToken)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', newRefreshToken, cookieOptions)

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
    })
  } catch (err) {
    // Missing/invalid/expired refresh — 401 so the client can clear session and redirect to login.
    res.status(401).json({ message: err.message })
  }
}

/**
 * Clears authentication cookies (client should also discard local login flags).
 * @param {import('express').Request} _req - Unused.
 * @param {import('express').Response} res - 200 JSON confirmation.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const logoutController = async (_req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
    })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    // Rare: cookie clear failure — 500 Internal Server Error.
    res.status(500).json({ message: err.message })
  }
}
