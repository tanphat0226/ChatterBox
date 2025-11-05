import express from 'express'
import { authController } from '../../controllers/auth.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'

const Router = express.Router()

Router.post('/signup', authController.signup)
Router.post('/login', authController.login)
Router.post('/logout', authController.logout)

Router.put('/update-profile', authMiddleware, authController.updateProfile)

Router.get('/check', authMiddleware, authController.checkAuth)

export const authRoutes = Router
