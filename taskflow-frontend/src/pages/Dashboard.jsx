import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import API from "../services/api"
import toast from "react-hot-toast"

import Sidebar from "../components/Sidebar"
import DarkModeToggle from "../components/DarkModeToggle"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [deadline, setDeadline] = useState("")
  const [filter, setFilter] = useState("all")
  const [confetti, setConfetti] = useState(false)

  const navigate = useNavigate()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token")

      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setTasks(res.data)

    } catch {
      toast.error("Failed to fetch tasks")
    }
  }

  const addTask = async () => {

    if (!title.trim()) {
      toast.error("Task cannot be empty")
      return
    }

    try {

      const token = localStorage.getItem("token")

      const res = await API.post(
        "/tasks",
        { title, priority, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTasks([...tasks, res.data])
      setTitle("")
      setDeadline("")
      setPriority("medium")

      toast.success("Task added")

    } catch {
      toast.error("Error adding task")
    }
  }

  const deleteTask = async (id) => {

    try {

      const token = localStorage.getItem("token")

      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setTasks(tasks.filter(t => t._id !== id))
      toast.success("Task deleted")

    } catch {
      toast.error("Error deleting task")
    }
  }

  const toggleComplete = async (task) => {

    try {

      const token = localStorage.getItem("token")

      const res = await API.put(
        `/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!task.completed) {
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2500)
      }

      setTasks(tasks.map(t => t._id === task._id ? res.data : t))

    } catch {
      toast.error("Error updating task")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task => {

    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true

  })

  const getPriorityColor = (p) => {
    if (p === "high") return "text-red-500"
    if (p === "medium") return "text-yellow-500"
    return "text-green-500"
  }

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black">

      {confetti && <Confetti />}

      <Sidebar setFilter={setFilter} logout={logout} />

      <DarkModeToggle />

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          TaskFlow Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-500 dark:text-gray-300">Total Tasks</h3>
            <p className="text-3xl font-bold dark:text-white">{totalTasks}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-500 dark:text-gray-300">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-500 dark:text-gray-300">Pending</h3>
            <p className="text-3xl font-bold text-red-500">{pendingTasks}</p>
          </div>

        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">

          <h3 className="mb-3 font-semibold dark:text-white">
            Task Completion Progress
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <motion.div
              className="bg-green-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
            />

          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round(progress)}% completed
          </p>

        </div>

        {/* Add Task */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">

          <div className="flex gap-3 flex-wrap">

            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg flex-1 dark:bg-gray-700 dark:text-white"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white"
            />

            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>

          </div>

        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <AnimatePresence>

            {filteredTasks.map(task => (

              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="border dark:border-gray-600 p-4 mb-3 rounded-lg flex justify-between items-center"
              >

                <div className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                  />

                  <div>

                    <p className={`${task.completed ? "line-through text-gray-400" : "dark:text-white"}`}>
                      {task.title}
                    </p>

                    <div className="text-sm flex gap-4">

                      <span className={getPriorityColor(task.priority)}>
                        {task.priority?.toUpperCase()}
                      </span>

                      {task.deadline && (
                        <span className="text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>

              </motion.div>

            ))}

          </AnimatePresence>

        </div>

      </div>

    </div>
  )
}

export default Dashboard