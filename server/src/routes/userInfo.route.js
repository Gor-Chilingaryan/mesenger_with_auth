/**
 * Module: userInfo.route.js
 * Description: Express router for reading and updating the authenticated user's profile.
 * Role in request lifecycle: HTTP boundary — requires `authMiddleware`, then forwards to user profile controllers.
 */
import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getUserInfoController, patchUserInfoController } from '../controllers/userInfo.controller.js'

const router = express.Router()

router.get('/user-info', authMiddleware, getUserInfoController)
router.patch('/user-info/changes', authMiddleware, patchUserInfoController)

export default router
