import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/api"
import toast from "react-hot-toast"

import Sidebar from "../components/Sidebar"
import DarkModeToggle from "../components/DarkModeToggle"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const navigate = useNavigate()

  // Stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100

  // Fetch Tasks
  const fetchTasks = async () => {
    try {

      const token = localStorage.getItem("token")

      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTasks(res.data)

    } catch (error) {
      toast.error("Failed to fetch tasks")
    }
  }

  // Add Task
  const addTask = async () => {

    if (!title.trim()) {
      toast.error("Task cannot be empty")
      return
    }

    try {

      const token = localStorage.getItem("token")

      const res = await API.post(
        "/tasks",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks([...tasks, res.data])
      setTitle("")
      toast.success("Task added")

    } catch (error) {
      toast.error("Error adding task")
    }
  }

  // Delete Task
  const deleteTask = async (id) => {
    try {

      const token = localStorage.getItem("token")

      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTasks(tasks.filter(task => task._id !== id))
      toast.success("Task deleted")

    } catch (error) {
      toast.error("Error deleting task")
    }
  }

  // Toggle Completion
  const toggleComplete = async (task) => {
    try {

      const token = localStorage.getItem("token")

      const res = await API.put(
        `/tasks/${task._id}`,
        { completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks(tasks.map(t => t._id === task._id ? res.data : t))

    } catch (error) {
      toast.error("Error updating task")
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (

    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

      <Sidebar logout={logout} />

      <DarkModeToggle />

      <div className="flex-1 p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold dark:text-white">
            TaskFlow Dashboard
          </h1>

        </div>

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

            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>

          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round(progress)}% completed
          </p>

        </div>

        {/* Add Task */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <div className="flex gap-3 mb-6">

            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="border p-3 rounded-lg flex-1 dark:bg-gray-700 dark:text-white"
            />

            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Task
            </button>

          </div>

          {/* Task List */}
          {tasks.length === 0 ? (

            <p className="text-gray-500 dark:text-gray-400 text-center">
              No tasks yet. Add your first task 🚀
            </p>

          ) : (

            tasks.map(task => (

              <div
                key={task._id}
                className="border dark:border-gray-600 p-3 mb-2 rounded-lg flex justify-between items-center"
              >

                <div className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                  />

                  <span className={`${task.completed ? "line-through text-gray-400" : "dark:text-white"}`}>
                    {task.title}
                  </span>

                </div>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  )
}

export default Dashboard