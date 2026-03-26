import { getAllNavigationService, createNavigationService, deleteNavigationService, updateNavigationService } from "../services/navigate.services.js"


export const allNavigationController = async (req, res) => {
  const result = await getAllNavigationService(req.user._id)

  res.status(result.status).json(result.json)
}

export const createNavigationController = async (req, res) => {
  const result = await createNavigationService({ ...req.body, owner: req.user._id })

  res.status(result.status).json(result.json)
}

export const deleteNavigationController = async (req, res) => {
  const result = await deleteNavigationService(req.params.id)

  res.status(result.status).json(result.json)
}

export const updateNaviagtionController = async (req, res) => {
  try {
    const { newOrder } = req.body
    const userId = req.user._id

    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ message: "Order updated successfully" })
    }

    await updateNavigationService(userId, newOrder)

    res.status(200).json({ message: "Navigation updated successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}