import express from 'express'
import { APIs_V1 } from './routes/v1/index.js'

const app = express()

// Use APIs
app.use('/api/v1', APIs_V1)

app.listen(5001, () => {
	console.log('Server is running on http://localhost:5001')
})
