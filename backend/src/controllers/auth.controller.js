import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../libs/utils.js'
import cloudinary from '../libs/cloudinary.js'

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
		console.error('Error in signup controller:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}
const login = async (req, res) => {
	const { email, password } = req.body
	try {
		const user = await User.findOne({ email })

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'Invalid credentials.',
			})
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				message: 'Invalid credentials.',
			})
		}

		generateToken(user._id, res)

		return res.status(StatusCodes.OK).json({
			id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePic: user.profilePic,
		})
	} catch (error) {
		console.error('Error in login controller:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error.',
		})
	}
}
const logout = (req, res) => {
	try {
		res.cookie('token', '', {
			maxAge: 0,
		})

		return res
			.status(StatusCodes.OK)
			.json({ message: 'Logged out successfully.' })
	} catch (error) {
		console.error('Error in logout controller:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Internal server error.',
		})
	}
}

const updateProfile = async (req, res) => {
	try {
		const { profilePic } = req.body
		const userId = req.user._id

		if (!profilePic) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Profile picture is required.',
			})
		}

		const uploadResponse = await cloudinary.uploader.upload(profilePic)
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic: uploadResponse.secure_url },
			{ new: true }
		)

		return res.status(StatusCodes.OK).json(updatedUser)
	} catch (error) {
		console.error('Error in updateProfile controller:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}

const checkAuth = async (req, res) => {
	try {
		res.status(StatusCodes.OK).json(req.user)
	} catch (error) {
		console.error('Error in checkAuth controller:', error)
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}

export const authController = {
	signup,
	login,
	logout,
	updateProfile,
	checkAuth,
}
