import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/api.js"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const navigate = useNavigate()

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
      console.error("Error fetching tasks", error)
    }
  }

  const addTask = async () => {
    try {

      if (!title.trim()) return

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

      setTasks((prev) => [...prev, res.data])
      setTitle("")

    } catch (error) {
      console.error("Error adding task", error)
    }
  }

  const updateTask = async (id) => {
    try {

      if (!editText.trim()) return

      const token = localStorage.getItem("token")

      const res = await API.put(
        `/tasks/${id}`,
        { title: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      )

      setEditingId(null)
      setEditText("")

    } catch (error) {
      console.error("Error updating task", error)
    }
  }

  const deleteTask = async (id) => {
    try {

      const token = localStorage.getItem("token")

      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTasks((prev) => prev.filter((task) => task._id !== id))

    } catch (error) {
      console.error("Error deleting task", error)
    }
  }

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

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? res.data : t
        )
      )

    } catch (error) {
      console.error("Error updating task", error)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          TaskFlow Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
        >
          Logout
        </button>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* Add Task */}
        <div className="mb-6 flex gap-3">

          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="border p-3 rounded-lg flex-1"
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
          <p className="text-gray-500 text-center">
            No tasks yet 🚀
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="border p-3 mb-2 rounded-lg flex justify-between items-center"
            >

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />

                {editingId === task._id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && updateTask(task._id)
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  <span
                    className={
                      task.completed
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {task.title}
                  </span>
                )}

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => {
                    setEditingId(task._id)
                    setEditText(task.title)
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default Dashboard