import express from 'express'
import { ENV } from './configs/environment.js'
import { connectDB } from './libs/db.js'
import { APIs_V1 } from './routes/v1/index.js'

const app = express()
const PORT = ENV.PORT

// Middleware
app.use(express.json())

// Use APIs
app.use('/api/v1', APIs_V1)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	connectDB()
})
