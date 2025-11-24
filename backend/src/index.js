import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { ENV } from './configs/environment.js'
import { connectDB } from './libs/db.js'
import { APIs_V1 } from './routes/v1/index.js'
import { app, server } from './libs/socket.js'
import path from 'path'

const PORT = ENV.PORT
const __dirname = path.resolve()

// Middleware
app.use(
	cors({
		origin: ENV.CLIENT_URL,
		credentials: true,
	})
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Use APIs
app.use('/api/v1', APIs_V1)

// Serve static files in production
if (ENV.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')))

	app.get('(.*)', (req, res) => {
		res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
	})
}

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	connectDB()
})
