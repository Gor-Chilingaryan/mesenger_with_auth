/**
 * Module: message.controller.js
 * Description: HTTP handlers for messenger conversations, message threads, sending messages, read receipts, and user search.
 * Role in request lifecycle: Controller layer — passes `req.user._id` and route/query params into message services; thin mapping to HTTP.
 */
import {
  getConversationsService,
  getMessagesService,
  sendMessageService,
  markAsReadService,
  searchUsersService,
} from '../services/message.services.js'

/**
 * Returns sidebar-style conversation summaries for the authenticated user.
 * @param {import('express').Request} req - Authenticated; current user id is `req.user._id`.
 * @param {import('express').Response} res - Forwards service `{ status, json }` (typically 200 + array).
 * @returns {Promise<void>}
 * @throws {void}
 */
export const getConversationsController = async (req, res) => {
  const result = await getConversationsService(req.user._id)
  res.status(result.status).json(result.json)
}

/**
 * Returns ordered messages between the current user and `partnerId`.
 * @param {import('express').Request} req - Params: `partnerId` — other participant's user id.
 * @param {import('express').Response} res - 200 + messages or 500 JSON from service on failure.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const getMessagesController = async (req, res) => {
  const result = await getMessagesService(req.user._id, req.params.partnerId)
  res.status(result.status).json(result.json)
}

/**
 * Creates an outbound message from the authenticated user to `partnerId`.
 * @param {import('express').Request} req - Params: `partnerId`. Body: `{ content: string }`.
 * @param {import('express').Response} res - 201 + populated message, 400/404/500 per service rules.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const sendMessageController = async (req, res) => {
  const result = await sendMessageService(
    req.user._id,
    req.params.partnerId,
    req.body.content
  )
  res.status(result.status).json(result.json)
}

/**
 * Marks inbound unread messages from `partnerId` as read for the current user.
 * @param {import('express').Request} req - Params: `partnerId`.
 * @param {import('express').Response} res - 200 confirmation or 500 on DB error.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const markAsReadController = async (req, res) => {
  const result = await markAsReadService(req.user._id, req.params.partnerId)
  res.status(result.status).json(result.json)
}

/**
 * Searches users by partial name/email for starting new chats (excludes self).
 * @param {import('express').Request} req - Query: `q` — search string.
 * @param {import('express').Response} res - 200 + user list (may be empty).
 * @returns {Promise<void>}
 * @throws {void}
 */
export const searchUsersController = async (req, res) => {
  const result = await searchUsersService(req.query.q, req.user._id)
  res.status(result.status).json(result.json)
}
