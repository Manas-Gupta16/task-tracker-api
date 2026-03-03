require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')

const app = express()

// Connect Database
connectDB()

// Middleware to parse JSON
app.use(express.json())

// Auth Routes
app.use('/api/auth', authRoutes)

// Protected Route
app.get('/api/profile', protect, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        userId: req.user
    })
})

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})