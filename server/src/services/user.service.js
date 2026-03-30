import userModel from '../models/userSchema.js'

export const getUsersService = async (query, currentUserId) => {
  if (!query) return []
  return await userModel.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
    ]

  }).select('firstName lastName email avatar')
}