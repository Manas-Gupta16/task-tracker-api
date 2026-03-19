const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body)

    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all fields" })
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("REGISTER ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.status(200).json({
      token,
    })
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  registerUser,
  loginUser,
}