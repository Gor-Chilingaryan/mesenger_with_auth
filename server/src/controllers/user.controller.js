import { getUsersService } from "../services/user.service.js"

export const searchUsersController = async (req, res) => {
  try {
    const { q } = req.query
    const users = await getUsersService(q, req.user._id)
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}