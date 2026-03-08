const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const userExists = await User.findOne({ email })
        if (userExists)
            return res.status(400).json({ message: "User already exists" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({ message: "User registered successfully" })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({ token })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}