/**
 * Module: message.services.js
 * Description: Messenger domain logic — conversation aggregation, thread fetch, send, read receipts, and user search.
 * Role in request lifecycle: Service layer — all functions take explicit user ids from controllers (`req.user._id`, params, query).
 */
import mongoose from 'mongoose'
import messageModel from '../models/messageSchema.js'
import userModel from '../models/userSchema.js'

/**
 * Builds conversation list with last message preview and unread counts for the sidebar.
 * @param {string|import('mongoose').Types.ObjectId} userId - Authenticated user id.
 * @returns {Promise<{status: number, json: object|Array}>} `200` and array of `{ user, lastMessage, unreadCount }`.
 * @throws {void} Errors return `{ status: 500, json }` instead of throwing.
 */
export const getConversationsService = async (userId) => {
  try {
    // $or: user can appear as sender or receiver — we need every message row touching this user to discover partners.
    const messages = await messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .sort({ createdAt: -1 })

    const partnerIds = new Set()
    const lastMessageMap = {}

    for (const msg of messages) {
      const partnerId =
        msg.sender.toString() === userId.toString()
          ? msg.receiver.toString()
          : msg.sender.toString()

      if (!partnerIds.has(partnerId)) {
        partnerIds.add(partnerId)
        lastMessageMap[partnerId] = msg
      }
    }

    if (partnerIds.size === 0) {
      return { status: 200, json: [] }
    }

    // $in: load all partner user docs in one query instead of N separate finds.
    const partners = await userModel
      .find({ _id: { $in: [...partnerIds] } })
      .select('firstName lastName avatar email')

    const partnerObjectIds = [...partnerIds].map(id => new mongoose.Types.ObjectId(id))
    const unreadCounts = await messageModel.aggregate([
      {
        $match: {
          receiver: userId,
          read: false,
          // $in: restrict unread aggregation to known partners only (avoids counting stray senders).
          sender: { $in: partnerObjectIds },
        },
      },
      { $group: { _id: '$sender', count: { $sum: 1 } } },
    ])

    const unreadMap = {}
    for (const item of unreadCounts) {
      unreadMap[item._id.toString()] = item.count
    }

    const conversations = partners.map(partner => ({
      user: partner,
      lastMessage: lastMessageMap[partner._id.toString()],
      unreadCount: unreadMap[partner._id.toString()] || 0,
    }))

    conversations.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    )

    return { status: 200, json: conversations }
  } catch (err) {
    // Aggregation/find failures — 500 Internal Server Error for the API consumer.
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

/**
 * Loads full two-party thread sorted oldest-first for chat rendering.
 * @param {string|import('mongoose').Types.ObjectId} userId - Current user.
 * @param {string|import('mongoose').Types.ObjectId} partnerId - Other participant from `req.params.partnerId`.
 * @returns {Promise<{status: number, json: object|Array}>} `200` + populated messages.
 * @throws {void}
 */
export const getMessagesService = async (userId, partnerId) => {
  try {
    const messages = await messageModel
      .find({
        // Either direction: A→B or B→A must match (bidirectional conversation thread).
        $or: [
          { sender: userId, receiver: partnerId },
          { sender: partnerId, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 })
      // populate: replace ObjectId refs with selected user fields for display names/avatars in the UI.
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')

    return { status: 200, json: messages }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

/**
 * Validates content and receiver, persists message, returns populated document for immediate UI append.
 * @param {string|import('mongoose').Types.ObjectId} senderId - `req.user._id`.
 * @param {string|import('mongoose').Types.ObjectId} receiverId - Route param partner id.
 * @param {string} content - From `req.body.content`.
 * @returns {Promise<{status: number, json: object}>} `201` + message, `400` empty content, `404` unknown receiver, `500` errors.
 * @throws {void}
 */
export const sendMessageService = async (senderId, receiverId, content) => {
  try {
    if (!content?.trim()) {
      return { status: 400, json: { message: 'Message content is required' } }
    }

    const receiver = await userModel.findById(receiverId)
    if (!receiver) {
      return { status: 404, json: { message: 'Receiver not found' } }
    }

    const message = await messageModel.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    })

    const populated = await message.populate([
      { path: 'sender', select: 'firstName lastName avatar' },
      { path: 'receiver', select: 'firstName lastName avatar' },
    ])

    return { status: 201, json: populated }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

/**
 * Marks all unread inbound messages from `partnerId` as read for `userId` (read receipt / badge clearing).
 * @param {string|import('mongoose').Types.ObjectId} userId - Authenticated user (the receiver side of unread rows).
 * @param {string|import('mongoose').Types.ObjectId} partnerId - Counterparty whose sent messages become `read: true`.
 * @returns {Promise<{status: number, json: object}>} `200` confirmation or `500` on failure.
 * @throws {void}
 */
export const markAsReadService = async (userId, partnerId) => {
  try {
    await messageModel.updateMany(
      { sender: partnerId, receiver: userId, read: false },
      { $set: { read: true } }
    )
    return { status: 200, json: { message: 'Messages marked as read' } }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

/**
 * Case-insensitive partial match on first name, last name, or email; excludes the current user from results.
 * @param {string} query - From `req.query.q`.
 * @param {string|import('mongoose').Types.ObjectId} currentUserId - Exclude self from matches.
 * @returns {Promise<{status: number, json: object|Array}>} `200` + up to 10 users.
 * @throws {void}
 */
export const searchUsersService = async (query, currentUserId) => {
  try {
    if (!query?.trim()) {
      return { status: 200, json: [] }
    }

    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'i')

    const users = await userModel
      .find({
        _id: { $ne: currentUserId },
        // $or: match any of the searchable fields with the same regex.
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
      })
      .select('firstName lastName avatar email')
      .limit(10)

    return { status: 200, json: users }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}
