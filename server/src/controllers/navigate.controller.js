/**
 * Module: navigate.controller.js
 * Description: HTTP handlers for user-owned navigation menus: list, create, delete, reorder, and child link management.
 * Role in request lifecycle: Controller layer — binds `req.user._id` to service calls; does not parse user id from cookies directly.
 */
import { getAllNavigationService, createNavigationService, deleteNavigationService, updateNavigationService, addChildNavigationService, deleteChildNavigationService } from "../services/navigate.services.js"

/**
 * Lists all navigation roots for the authenticated owner, sorted by `index`.
 * @param {import('express').Request} req - Authenticated; owner id is `req.user._id`.
 * @param {import('express').Response} res - Status and JSON from service (typically 200 + array).
 * @returns {Promise<void>}
 * @throws {void}
 */
export const allNavigationController = async (req, res) => {
  const result = await getAllNavigationService(req.user._id)

  res.status(result.status).json(result.json)
}

/**
 * Creates a navigation item; forces `owner` from the authenticated user.
 * @param {import('express').Request} req - Body: `{ name, path, ... }`; merged with `owner: req.user._id`.
 * @param {import('express').Response} res - 201 + created doc or error payload from service.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const createNavigationController = async (req, res) => {
  const result = await createNavigationService({ ...req.body, owner: req.user._id })

  res.status(result.status).json(result.json)
}

/**
 * Deletes a top-level navigation item by Mongo `_id`.
 * @param {import('express').Request} req - Params: `id` — navigation document id (not validated for ownership in this controller; service uses findById only).
 * @param {import('express').Response} res - 200/404/500 per service result.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const deleteNavigationController = async (req, res) => {
  const result = await deleteNavigationService(req.params.id)

  res.status(result.status).json(result.json)
}

/**
 * Bulk-updates display order for navigation items belonging to the current user.
 * @param {import('express').Request} req - Body: `{ newOrder: string[] }` — ordered array of navigation `_id` values (see `updateNavigationService`).
 * @param {import('express').Response} res - 200 on success; 400 if `newOrder` is not an array; 500 on persistence errors.
 * @returns {Promise<void>}
 * @throws {void}
 */
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
    // bulkWrite or DB failures — 500 Internal Server Error.
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

/**
 * Appends a child link document to a parent navigation item.
 * @param {import('express').Request} req - Params: `id` (parent). Body: `{ name, path }`.
 * @param {import('express').Response} res - 200 with updated parent or error status from service.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const addChildController = async (req, res) => {
  const { id } = req.params
  const { name, path } = req.body

  const result = await addChildNavigationService(id, { name, path })
  res.status(result.status).json(result.json)
}

/**
 * Removes one child subdocument from a parent navigation item.
 * @param {import('express').Request} req - Params: `parentId`, `childId`.
 * @param {import('express').Response} res - 200 with updated parent, 404 if parent missing, 500 on error.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const deleteChildController = async (req, res) => {
  const { parentId, childId } = req.params
  const result = await deleteChildNavigationService(parentId, childId)

  res.status(result.status).json(result.json)
}
