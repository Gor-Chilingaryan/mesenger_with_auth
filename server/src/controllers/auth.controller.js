import { createUserService, loginUserService, forgotPasswordService, newPasswordService, refreshServices } from "../services/auth.services.js"



const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
}


export const loginUserController = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUserService(req.body)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json(user)
  } catch (err) {
    if (err.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: err.message })
    }

    res.status(500).json({ message: err.message })
  }
}

export const registerController = async (req, res) => {
  try {
    // create user
    const { user, accessToken, refreshToken } = await createUserService(req.body)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(201).json(user)
  } catch (err) {
    if (err.code === "EMAIL_EXISTS") {
      return res.status(409).json({ message: err.message })
    }

    res.status(500).json({ message: err.message })
  }
}

export const forgotPasswordController = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email)

    res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const newPasswordController = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await newPasswordService(req.body.email, req.body.password)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({ message: 'Password updated successfully', user })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) throw new Error('No refresh token found')

    const { accessToken, refreshToken } = await refreshServices(token)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({ message: 'Token refreshed successfully' })
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}
