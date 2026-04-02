import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import API from "../services/api"
import toast from "react-hot-toast"

import Sidebar from "../components/Sidebar"
import DarkModeToggle from "../components/DarkModeToggle"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [deadline, setDeadline] = useState(null)
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

      setTasks([res.data, ...tasks])

      setTitle("")
      setPriority("medium")
      setDeadline(null)

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

  const formatDeadline = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
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

        {/* Add Task */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">

          <div className="grid md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white"
            />

            {/* Priority Dropdown */}
            <div className="relative">

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border p-3 rounded-lg appearance-none w-full dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                ▼
              </div>

            </div>

            {/* Date Picker */}
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select deadline"
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
            />

            <button
              onClick={addTask}
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Task
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

                  <div className="flex flex-col">

                    <span className={`${task.completed ? "line-through text-gray-400" : "dark:text-white"}`}>
                      {task.title}
                    </span>

                    <div className="text-sm text-gray-500 flex gap-3 mt-1">

                      <span className={`
                        px-2 py-1 rounded text-xs font-semibold
                        ${task.priority === "high" && "bg-red-100 text-red-600"}
                        ${task.priority === "medium" && "bg-yellow-100 text-yellow-600"}
                        ${task.priority === "low" && "bg-green-100 text-green-600"}
                      `}>
                        {task.priority.toUpperCase()}
                      </span>

                      {task.deadline && (
                        <span>
                          ⏰ {formatDeadline(task.deadline)}
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