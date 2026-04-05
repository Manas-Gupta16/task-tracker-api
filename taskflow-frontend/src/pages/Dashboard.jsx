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

  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)

  const [editingTask, setEditingTask] = useState(null)

  const [filter, setFilter] = useState("all")
  const [confetti, setConfetti] = useState(false)

  const navigate = useNavigate()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks

  useEffect(() => {
    fetchTasks()
  }, [])

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
        { title, priority, startTime, endTime },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTasks([res.data, ...tasks])

      setTitle("")
      setPriority("medium")
      setStartTime(null)
      setEndTime(null)

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

      setTasks(tasks.map(t =>
        t._id === task._id ? res.data : t
      ))

    } catch {
      toast.error("Error updating task")
    }

  }

  const startEdit = (task) => {

    setEditingTask({
      _id: task._id,
      title: task.title,
      priority: task.priority,
      startTime: task.startTime ? new Date(task.startTime) : null,
      endTime: task.endTime ? new Date(task.endTime) : null
    })

  }

  const saveEdit = async () => {

    try {

      const token = localStorage.getItem("token")

      const updatedTask = {
        title: editingTask.title,
        priority: editingTask.priority,
        startTime: editingTask.startTime,
        endTime: editingTask.endTime
      }

      const res = await API.put(
        `/tasks/${editingTask._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTasks(tasks.map(t =>
        t._id === editingTask._id ? res.data : t
      ))

      setEditingTask(null)

      toast.success("Task updated")

    } catch (err) {

      console.error(err)
      toast.error("Update failed")

    }

  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const formatTime = (date) => {

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    })

  }

  const getTaskStatus = (task) => {

    if (!task.startTime || !task.endTime) return null

    const now = new Date()
    const start = new Date(task.startTime)
    const end = new Date(task.endTime)

    if (now > end) return { label: "Overdue", color: "text-red-500" }
    if (now >= start && now <= end) return { label: "Happening Now", color: "text-yellow-500" }

    return { label: "Upcoming", color: "text-green-500" }

  }

  const filteredTasks = tasks.filter(task => {

    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed

    return true

  })

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

          <div className="grid md:grid-cols-5 gap-4">

            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white"
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

            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Start time"
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
            />

            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="End time"
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

            {filteredTasks.map(task => {

              const status = getTaskStatus(task)

              return (

                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="border dark:border-gray-600 p-4 mb-3 rounded-lg flex justify-between items-center"
                >

                  {editingTask && editingTask._id === task._id ? (

                    <div className="grid md:grid-cols-5 gap-3 w-full">

                      <input
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, title: e.target.value })
                        }
                        className="border p-2 rounded"
                      />

                      <select
                        value={editingTask.priority}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, priority: e.target.value })
                        }
                        className="border p-2 rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>

                      <DatePicker
                        selected={editingTask.startTime}
                        onChange={(date) =>
                          setEditingTask({ ...editingTask, startTime: date })
                        }
                        showTimeSelect
                        dateFormat="MMM d h:mm aa"
                        className="border p-2 rounded"
                      />

                      <DatePicker
                        selected={editingTask.endTime}
                        onChange={(date) =>
                          setEditingTask({ ...editingTask, endTime: date })
                        }
                        showTimeSelect
                        dateFormat="MMM d h:mm aa"
                        className="border p-2 rounded"
                      />

                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white rounded"
                      >
                        Save
                      </button>

                    </div>

                  ) : (

                    <div className="flex items-center justify-between w-full">

                      <div className="flex items-center gap-3">

                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task)}
                        />

                        <div>

                          <span className={`font-medium ${task.completed ? "line-through text-gray-400" : "dark:text-white"}`}>
                            {task.title}
                          </span>

                          <div className="text-sm flex gap-3 mt-1">

                            <span className="uppercase text-gray-500">
                              {task.priority}
                            </span>

                            {task.startTime && task.endTime && (
                              <span>
                                ⏰ {formatTime(task.startTime)} → {formatTime(task.endTime)}
                              </span>
                            )}

                            {status && (
                              <span className={status.color}>
                                {status.label}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <button
                          onClick={() => startEdit(task)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )}

                </motion.div>

              )

            })}

          </AnimatePresence>

        </div>

      </div>

    </div>

  )

}

export default Dashboard