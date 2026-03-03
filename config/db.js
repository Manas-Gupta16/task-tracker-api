const mongoose = require('mongoose')

const connectDB = async () => {
    console.log("connectDB function called")   // 👈 ADD THIS

    try {
        console.log("Trying MongoDB connection...")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")
    } catch (err) {
        console.error("MongoDB Error:", err.message)
        process.exit(1)
    }
}

module.exports = connectDB