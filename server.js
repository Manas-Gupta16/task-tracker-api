require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Connect Database
connectDB()

// Security Middleware (Helmet sets various HTTP headers)
app.use(helmet())

// Rate Limiting (Prevents brute force attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
})
app.use('/api', limiter)

// Enable CORS
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173']
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false)
        }
        return callback(null, true)
    },
    credentials: true
}))

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

// Health Check Route  ← PASTE HERE
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date()
    })
})

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})