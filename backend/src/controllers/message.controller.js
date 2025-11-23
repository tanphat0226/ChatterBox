import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import cloudinary from '../libs/cloudinary.js'

const getUserForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user.id
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId },
		}).select('-password')

		return res.status(StatusCodes.OK).json(filteredUsers)
	} catch (error) {
		console.error('Error in getUserForSidebar controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}

const getMessages = async (req, res) => {
	try {
		const { id: userToChatWithId } = req.params
		const senderId = req.user.id

		const messages = await Message.find({
			$or: [
				{ senderId: senderId, receiverId: userToChatWithId },
				{ senderId: userToChatWithId, receiverId: senderId },
			],
		})

		res.status(StatusCodes.OK).json(messages)
	} catch (error) {
		console.error('Error in getMessages controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}

const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body
		const { id: receiverId } = req.params
		const senderId = req.user.id

		let imageUrl

		if (image) {
			// upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image)
			imageUrl = uploadResponse.secure_url
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		})

		await newMessage.save()

		// TODO: Emit socket event here for real-time message delivery

		res.status(StatusCodes.CREATED).json(newMessage)
	} catch (error) {
		console.error('Error in sendMessage controller:', error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Server error. Please try again later.',
		})
	}
}

export const messageController = {
	getUserForSidebar,
	getMessages,
	sendMessage,
}
