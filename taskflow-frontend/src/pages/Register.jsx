import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import toast from "react-hot-toast"

import API from "../services/api"
import DarkModeToggle from "../components/DarkModeToggle"

function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {

    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("All fields are required")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    try {

      setLoading(true)

      const res = await API.post("/auth/register", {
        name,
        email,
        password
      })

      toast.success("Account created successfully")

      navigate("/")

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Registration failed"
      )

    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 dark:from-gray-900 dark:to-black">

      <DarkModeToggle />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 w-full max-w-md"
      >

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white">
          Create Account
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Start managing your tasks today
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />

          </div>

          {/* Email */}
          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />

          </div>

          {/* Password */}
          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >

              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}

            </button>

          </div>

          {/* Register Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >

            {loading ? "Creating account..." : "Register"}

          </motion.button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">

          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>

        </p>

      </motion.div>

    </div>

  )

}

export default Register