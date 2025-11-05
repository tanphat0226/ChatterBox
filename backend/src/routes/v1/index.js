import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { authRoutes } from './auth.route.js'
import { messageRoutes } from './message.route.js'

const Router = express.Router()

// Check APIs v1/status
Router.get('/status', (req, res) => {
	res.status(StatusCodes.OK).json({
		success: true,
		message: 'APIs V1 are ready to use.',
	})
})

// Auth APIs
Router.use('/auth', authRoutes)

// Message APIs
Router.use('/messages', messageRoutes)

export const APIs_V1 = Router
