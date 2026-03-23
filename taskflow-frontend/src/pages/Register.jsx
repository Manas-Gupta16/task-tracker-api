import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api.js"
import toast from "react-hot-toast"

function Register() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {

      if (!email || !password) {
        toast.error("Please fill all fields ❌")
        return
      }

      await API.post("/auth/register", {
        email,
        password
      })

      toast.success("Registration successful 🎉")

      navigate("/")

    } catch (error) {

      console.log("REGISTER ERROR:", error.response)

      toast.error(
        error.response?.data?.message || "Server error ❌"
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
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
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  )
}

export default Register