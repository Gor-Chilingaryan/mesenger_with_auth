/**
 * Module: messageSchema.js
 * Description: Mongoose schema for direct messages between users (sender, receiver, content, read flag, timestamps).
 * Role in request lifecycle: Persistence layer — message services read/write documents; indexes support conversation and sort queries.
 */
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt for ordering and "last message" previews
  }
)

// Compound index: speeds up queries that filter by sender+receiver pairs (conversation threads).
messageSchema.index({ sender: 1, receiver: 1 })
// createdAt index: supports sorting messages chronologically without full collection scans at scale.
messageSchema.index({ createdAt: 1 })

const messageModel = mongoose.model('Message', messageSchema)

export default messageModel
