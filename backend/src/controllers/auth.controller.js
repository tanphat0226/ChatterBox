import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../libs/utils.js'

const MIN_PASSWORD_LENGTH = 6

const signup = async (req, res) => {
	const { fullName, email, password } = req.body
	try {
		// Check if required fields are provided
		if (!fullName || !email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Please provide all required fields.',
			})
		}

		// Check password length
		if (password.length < MIN_PASSWORD_LENGTH) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Password must be at least 6 characters long.',
			})
		}

		// Check if email already exists
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(StatusCodes.CONFLICT).json({
				message: 'Email already exists.',
			})
		}

		// Hash password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Create new user
		const newUser = new User({ fullName, email, password: hashedPassword })

		//
		if (newUser) {
			// Generate JWT Token
			generateToken(newUser._id, res)
			await newUser.save()

			return res.status(StatusCodes.CREATED).json({
				id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profilePic,
			})
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Invalid user data.',
			})
		}
	} catch (error) {
		console.error('Error during signup:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}
const login = (req, res) => {
	res.send('Login Endpoint')
}
const logout = (req, res) => {
	res.send('Logout Endpoint')
}

export const authController = {
	signup,
	login,
	logout,
}
