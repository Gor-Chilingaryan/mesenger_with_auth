import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { allNavigationController, createNavigationController, deleteNavigationController, updateNaviagtionController } from '../controllers/navigate.controller.js'

const router = express.Router()

router.get('/home-navigation-all', authMiddleware, allNavigationController) //get all navigation
router.post('/home-navigation-create', authMiddleware, createNavigationController) //create navigation
router.delete('/home-navigation/:id', authMiddleware, deleteNavigationController) //delete navigation
router.patch('/update-order', authMiddleware, updateNaviagtionController)

export default router
