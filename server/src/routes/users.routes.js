import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { searchUsersController } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/search-users', authMiddleware, searchUsersController)

export default router