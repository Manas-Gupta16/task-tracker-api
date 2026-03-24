import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api.js"
import toast from "react-hot-toast"

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          TaskFlow Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white 
          ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>

    </div>
  )
}

export default Login