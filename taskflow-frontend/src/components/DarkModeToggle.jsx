import { useState, useEffect } from "react"
import { FaMoon, FaSun } from "react-icons/fa"

function DarkModeToggle() {

  const [dark, setDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem("theme")

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {

    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }

    setDark(!dark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 bg-gray-800 dark:bg-yellow-400 text-white dark:text-black p-3 rounded-full shadow-lg hover:scale-110 transition"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  )
}

export default DarkModeToggle