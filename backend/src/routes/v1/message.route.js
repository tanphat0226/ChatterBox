import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { messageController } from '../../controllers/message.controller.js'

const Router = express.Router()

Router.get('/users', authMiddleware, messageController.getUserForSidebar)
Router.get('/:id', authMiddleware, messageController.getMessages)

Router.post('/send/:id', authMiddleware, messageController.sendMessage)

export const messageRoutes = Router
