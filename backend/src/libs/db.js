import mongoose from 'mongoose'
import { ENV } from '../configs/environment.js'

export const connectDB = async () => {
	try {
		console.log('Connecting to MongoDB...')
		const connection = await mongoose.connect(ENV.MONGODB_URI)
		console.log(`MongoDB connected: ${connection.connection.host}`)
	} catch (error) {
		console.error('Error connecting to MongoDB:', error)
	}
}
