import express from 'express'
import { authController } from '../../controllers/auth.controller.js'

const Router = express.Router()

Router.post('/signup', authController.signup)
Router.post('/login', authController.login)
Router.post('/logout', authController.logout)

export const authRoutes = Router
