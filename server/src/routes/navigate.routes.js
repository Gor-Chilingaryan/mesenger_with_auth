/**
 * Module: navigate.routes.js
 * Description: Express router for authenticated navigation CRUD, child menu operations, and bulk reorder.
 * Role in request lifecycle: HTTP boundary — applies `authMiddleware` then delegates to navigation controllers.
 */
import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { allNavigationController, createNavigationController, deleteNavigationController, updateNaviagtionController, addChildController, deleteChildController } from '../controllers/navigate.controller.js'

const router = express.Router()

router.get('/home-navigation-all', authMiddleware, allNavigationController)
router.post('/home-navigation-create', authMiddleware, createNavigationController)
router.delete('/home-navigation/:id', authMiddleware, deleteNavigationController)
router.patch('/update-order', authMiddleware, updateNaviagtionController)

router.post('/home-navigation/:id/child', authMiddleware, addChildController)
router.delete('/home-navigation/:parentId/child/:childId', authMiddleware, deleteChildController)
router.post('/home-navigation/:parentId/:childId', authMiddleware, deleteChildController)

export default router
