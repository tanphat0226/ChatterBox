import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import { ENV } from '../configs/environment.js'

export const authMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies.token || ''
		if (!token) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Unauthorized - No token provided' })
		}

		const decoded = jwt.verify(token, ENV.JWT_SECRET)

		if (!decoded) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Unauthorized - Invalid token' })
		}

		const user = await User.findById(decoded.userId).select('-password')

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'User not found' })
		}

		// Attach the user object to the request for further use
		req.user = user

		next()
	} catch (error) {
		console.error('Error in auth middleware:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error.',
		})
	}
}
