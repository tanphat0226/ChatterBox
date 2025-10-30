import jwt from 'jsonwebtoken'
import { ENV } from '../configs/environment.js'

export const generateToken = (userId, res) => {
	const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
		expiresIn: '7d',
	})

	res.cookie('token', token, {
		httpOnly: true, // Prevents XSS attacks cross-site scripting attacks
		secure: ENV.NODE_ENV !== 'development',
		sameSite: 'strict', // CSRF protection
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (in milliseconds)
	})

	return token
}
