import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function DarkModeToggle() {

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {

    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

  }, [dark])

  return (

    <motion.button
      onClick={() => setDark(!dark)}
      whileTap={{ scale: 0.9 }}
      className="fixed top-5 right-5 bg-white dark:bg-gray-800 shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-xl z-50"
    >

      {dark ? (
        <motion.span
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          ☀️
        </motion.span>
      ) : (
        <motion.span
          initial={{ rotate: 90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          🌙
        </motion.span>
      )}

    </motion.button>

  )
}

export default DarkModeToggle