/**
 * Module: navigate.services.js
 * Description: Persistence logic for custom navigation trees — list by owner, create, delete, reorder, and nested child menus.
 * Role in request lifecycle: Service layer — called from navigation controllers with explicit `userId` or item ids from params/body.
 */
import navigateModel from '../models/navigateSchema.js'

/**
 * Fetches all navigation documents owned by `userId`, ordered for UI display.
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner id from `req.user._id`.
 * @returns {Promise<{status: number, json: object|Array}>} `200` and items array on success.
 * @throws {object} `{ status: 500, json }` on query failures (thrown object for controller to handle if extended).
 */
export const getAllNavigationService = async (userId) => {
  try {
    const items = await navigateModel
      .find({ owner: userId })
      .sort({ index: 1 })

    return {
      status: 200,
      json: items
    }

  } catch (err) {
    // Query errors (e.g. invalid ObjectId shape, DB down) — wrapped for consistent error payload shape upstream.
    console.error(err)
    throw { status: 500, json: { message: err.message, error: err.message } }
  }
}

/**
 * Inserts a navigation row; Mongoose enforces unique (owner, path) and (owner, name) indexes.
 * @param {{name: string, path: string, isDefault?: boolean, owner: string|import('mongoose').Types.ObjectId}} body - Includes `owner` set by controller.
 * @returns {Promise<{status: number, json: object}>} `201` + created document.
 * @throws {object} `{ status: 400, json }` on duplicate key or validation errors from `create`.
 */
export const createNavigationService = async (body) => {
  try {
    const { name, path, isDefault = false, owner } = body

    const item = await navigateModel.create({ name, path, isDefault, owner })

    return { status: 201, json: item }

  } catch (err) {
    // Typical: Mongo duplicate key (E11000) or schema validation — 400 Bad Request for client-correctable issues.
    console.error(err)

    throw { status: 400, json: { message: err.message, error: err.message } }
  }
}

/**
 * Deletes a navigation document by `_id` without checking owner (caller should ensure authorization at route level if required).
 * @param {string} id - From `req.params.id`.
 * @returns {Promise<{status: number, json: object}>} `200` success, `404` if missing, `500` on unexpected errors.
 * @throws {void}
 */
export const deleteNavigationService = async (id) => {
  try {
    const item = await navigateModel.findById(id)

    if (!item) {
      return {
        status: 404,
        json: { message: 'Item not found' }
      }
    }
    await navigateModel.findByIdAndDelete(id)

    return {
      status: 200,
      json: { message: 'Item deleted Successfully' }
    }
  } catch (err) {
    // DB/runtime errors during find/delete — 500 Internal Server Error.
    console.log(err)
    return {
      status: 500,
      json: {
        message: err.message,
      }
    }
  }
}

/**
 * Applies new ordering by updating `index` for each id, scoped to the authenticated owner in the filter.
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner id; combined in each `updateOne` filter so users cannot reorder others' rows.
 * @param {string[]} newOrder - Ordered Mongo `_id` strings for top-level items.
 * @returns {Promise<import('mongoose').mongo.BulkWriteResult>} Mongoose bulk write result.
 * @throws {Error} Propagates bulk write errors (controller maps to 500).
 */
export const updateNavigationService = async (userId, newOrder) => {
  // bulkWrite: one round-trip; each op only updates if `_id` AND `owner` match (prevents cross-tenant updates if ids leak).
  const operations = newOrder.map((id, idx) => ({
    updateOne: {
      filter: { _id: id, owner: userId },
      update: { $set: { index: idx + 1 } },
    }
  }));

  return await navigateModel.bulkWrite(operations);
};

/**
 * Pushes a subdocument into `childMenu` on the parent document.
 * @param {string} parentId - Parent navigation id from `req.params.id`.
 * @param {{name: string, path: string}} childData - Child fields from `req.body`.
 * @returns {Promise<{status: number, json: object}>} `200` + updated parent, `400` if parent missing, `500` on failure.
 * @throws {void}
 */
export const addChildNavigationService = async (parentId, childData) => {
  try {
    // $push adds an element to the embedded array; runValidators ensures child sub-schema rules apply.
    const updatedItem = await navigateModel.findByIdAndUpdate(
      parentId,
      { $push: { childMenu: childData } },
      { new: true, runValidators: true }
    )
    if (!updatedItem) {
      return { status: 400, json: { message: 'Parent not found to add child' } }
    }

    return { status: 200, json: updatedItem }
  } catch (err) {
    // Validation or DB errors during array push — 500 Internal Server Error.
    return { status: 500, json: { message: err.message } }
  }
}

/**
 * Removes a child subdocument by `_id` from the parent's `childMenu` array.
 * @param {string} parentId - From `req.params.parentId`.
 * @param {string} childId - Subdocument `_id` from `req.params.childId`.
 * @returns {Promise<{status: number, json: object}>} `200` + updated parent, `404` if parent not found, `500` on error.
 * @throws {void}
 */
export const deleteChildNavigationService = async (parentId, childId) => {
  try {
    // $pull removes array elements matching the predicate — here by subdocument _id.
    const updatedItem = await navigateModel.findByIdAndUpdate(
      parentId,
      { $pull: { childMenu: { _id: childId } } },
      { new: true }
    )

    if (!updatedItem) {
      return { status: 404, json: { message: 'Parent item not found' } }
    }
    return { status: 200, json: updatedItem }
  } catch (err) {
    return { status: 500, json: { message: err.message } }
  }
}
