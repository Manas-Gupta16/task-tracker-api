require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Connect Database
connectDB()

// Middleware to parse JSON
app.use(express.json())

// Root Route (NEW)
app.get('/', (req,res)=>{
    res.json({
        message: "Task Tracker API",
        status: "Running"
    })
})

// Auth Routes
app.use('/api/auth', authRoutes)

// Task Routes
app.use('/api/tasks', taskRoutes)

// Protected Route
app.get('/api/profile', protect, (req, res) => {
    res.json(req.user)
})

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})