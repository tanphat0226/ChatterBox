import 'dotenv/config'

const ENV = {
	MONGODB_URI: process.env.MONGODB_URI,
	PORT: process.env.PORT || 5000,
	JWT_SECRET: process.env.JWT_SECRET,
	NODE_ENV: process.env.NODE_ENV || 'development',
	CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
}

export { ENV }
