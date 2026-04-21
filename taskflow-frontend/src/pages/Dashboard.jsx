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
  const [description, setDescription] = useState("") // ✅ NEW
  const [priority, setPriority] = useState("medium")

  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)

  const [editingTask, setEditingTask] = useState(null)

  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const [confetti, setConfetti] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

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
        {
          title,
          description, // ✅ NEW
          priority,
          startTime: startTime?.toISOString(),
          endTime: endTime?.toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTasks(prev => [res.data, ...prev])

      setTitle("")
      setDescription("") // ✅ NEW
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

      setTasks(prev => prev.filter(t => t._id !== id))

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

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id ? res.data : t
        )
      )

      if (!task.completed) {
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2000)
      }

    } catch {
      toast.error("Error updating task")
    }

  }

  const startEdit = (task) => {

    setEditingTask({
      _id: task._id,
      title: task.title,
      description: task.description || "", // ✅ NEW
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
        description: editingTask.description, // ✅ NEW
        priority: editingTask.priority,
        startTime: editingTask.startTime?.toISOString(),
        endTime: editingTask.endTime?.toISOString()
      }

      const res = await API.put(
        `/tasks/${editingTask._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTasks(prev =>
        prev.map(t =>
          t._id === editingTask._id ? res.data : t
        )
      )

      setEditingTask(null)

      toast.success("Task updated")

    } catch {
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

    const now = new Date().getTime()
    const start = new Date(task.startTime).getTime()
    const end = new Date(task.endTime).getTime()

    if (now > end) return { label: "Overdue", color: "text-red-500" }

    if (now >= start && now <= end)
      return { label: "Happening Now", color: "text-yellow-500" }

    return { label: "Upcoming", color: "text-green-500" }

  }

  const getPriorityStyle = (priority) => {

    if (priority === "high")
      return "bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold"

    if (priority === "medium")
      return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold"

    return "bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold"

  }

  const formatPriority = (p) => {
    return p.charAt(0).toUpperCase() + p.slice(1)
  }

  const markAllCompleted = async () => {

  try {
    setBulkLoading(true)

    const token = localStorage.getItem("token")

    const incompleteTasks = tasks.filter(t => !t.completed)

    if (incompleteTasks.length === 0) {
      toast("All tasks already completed")
      setBulkLoading(false)
      return
    }

    const updatedResponses = await Promise.all(
      incompleteTasks.map(task =>
        API.put(
          `/tasks/${task._id}`,
          { completed: true },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
    )

    const updatedTasksMap = new Map(
      updatedResponses.map(res => [res.data._id, res.data])
    )

    setTasks(prev =>
      prev.map(task =>
        updatedTasksMap.get(task._id) || task
      )
    )

    setConfetti(true)
    setTimeout(() => setConfetti(false), 2000)

    toast.success("All tasks completed 🚀")

  } catch {
    toast.error("Failed to update tasks")
  } finally {
    setBulkLoading(false)
  }

}

 

  const filteredTasks = tasks.filter(task => {

    const matchesFilter =
      filter === "completed"
        ? task.completed
        : filter === "pending"
        ? !task.completed
        : true

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase())

    return matchesFilter && matchesSearch

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
          <StatCard title="Total Tasks" value={totalTasks} />
          <StatCard title="Completed" value={completedTasks} color="text-green-600" />
          <StatCard title="Pending" value={pendingTasks} color="text-red-500" />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full mb-6 dark:bg-gray-700 dark:text-white"
        />

        {/* Add Task */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <div className="flex flex-wrap items-center gap-4">

            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg dark:bg-gray-700 dark:text-white"
            />

            {/* ✅ DESCRIPTION INPUT */}
            <input
              type="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
            />

            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              className="border p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
            />

            <button
  onClick={addTask}
  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap"
>
  Add Task
</button>
            <button
  onClick={markAllCompleted}
  disabled={bulkLoading || tasks.every(t => t.completed)}
  className={`px-5 py-3 rounded-lg text-white transition font-medium whitespace-nowrap
    ${bulkLoading || tasks.every(t => t.completed)
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"}
  `}
>
  {bulkLoading ? "Completing..." : "Complete All"}
</button>

          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <AnimatePresence>

            {filteredTasks.map((task) => {

              const status = getTaskStatus(task)

              return (

                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="border dark:border-gray-600 p-4 mb-3 rounded-lg"
                >

                  {editingTask && editingTask._id === task._id ? (

                    <div className="flex flex-wrap gap-3 w-full items-center">

                      <input
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, title: e.target.value })
                        }
                        className="border p-2 rounded"
                      />

                      <input
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, description: e.target.value })
                        }
                        className="border p-2 rounded"
                        placeholder="Description"
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
                        className="border p-2 rounded"
                      />

                      <DatePicker
                        selected={editingTask.endTime}
                        onChange={(date) =>
                          setEditingTask({ ...editingTask, endTime: date })
                        }
                        showTimeSelect
                        className="border p-2 rounded"
                      />

                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-3 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-500 text-white px-3 rounded"
                      >
                        Cancel
                      </button>

                    </div>

                  ) : (

                    <div className="flex items-center justify-between">

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
          

                          {/* ✅ DESCRIPTION DISPLAY */}
                          {task.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {task.description}
                            </p>
                          )}

                          <div className="text-sm flex gap-3 mt-1 items-center">

                            <span className={getPriorityStyle(task.priority)}>
                              {formatPriority(task.priority)}
                            </span>

                            {task.startTime && task.endTime && (
                              <span>
                                ⏰ {formatTime(task.startTime)} → {formatTime(task.endTime)}
                              </span>
                            )}

                            {status && (
                              <span className={`font-semibold ${status.color}`}>
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

function StatCard({ title, value, color }) {

  return (

    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">

      <h3 className="text-gray-500 dark:text-gray-300">{title}</h3>

      <p className={`text-3xl font-bold ${color || "dark:text-white"}`}>
        {value}
      </p>

    </div>

  )

}



export default Dashboard