import 'dotenv/config'

const ENV = {
	MONGODB_URI: process.env.MONGODB_URI,
	PORT: process.env.PORT || 5000,
}

export { ENV }
