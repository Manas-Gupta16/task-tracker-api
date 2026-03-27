import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import API from "../services/api.js"
import toast from "react-hot-toast"
import DarkModeToggle from "../components/DarkModeToggle"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) navigate("/dashboard")
  }, [])

  const handleLogin = async () => {

    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    try {

      setLoading(true)

      const res = await API.post("/auth/login", {
        email,
        password
      })

      localStorage.setItem("token", res.data.token)

      toast.success("Login successful 🚀")

      navigate("/dashboard")

    } catch (error) {

      toast.error("Invalid credentials")

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black">

      <DarkModeToggle />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 p-10 rounded-2xl shadow-2xl w-full max-w-md"
      >

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          TaskFlow
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Login to manage your tasks
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 p-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all flex justify-center items-center"
        >

          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}

        </button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">

          Don't have an account?{" "}

          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>

        </p>

      </motion.div>

    </div>
  )
}

export default Login