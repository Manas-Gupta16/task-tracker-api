require('dotenv').config()   // 1️⃣ Load env variables

const express = require('express')
const connectDB = require('./config/db')

connectDB()                  // 2️⃣ Now DB can read MONGO_URI

const app = express()

app.get('/', (req,res)=>{
    res.send("API Running")
})

app.listen(5000, ()=>{
    console.log("Server running on port 5000")
})