/**
 * Module: message.routes.js
 * Description: Express router for messenger features (conversations, messages, read receipts, user search).
 * Role in request lifecycle: HTTP boundary — all routes are protected by `authMiddleware` before message controllers run.
 */
import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  getConversationsController,
  getMessagesController,
  sendMessageController,
  markAsReadController,
  searchUsersController,
} from '../controllers/message.controller.js'

const router = express.Router()

router.get('/messenger/conversations', authMiddleware, getConversationsController)
router.get('/messenger/messages/:partnerId', authMiddleware, getMessagesController)
router.post('/messenger/messages/:partnerId', authMiddleware, sendMessageController)
router.patch('/messenger/messages/:partnerId/read', authMiddleware, markAsReadController)
router.get('/messenger/users/search', authMiddleware, searchUsersController)

export default router
