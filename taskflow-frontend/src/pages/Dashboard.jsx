import { useEffect, useState } from "react"
import API from "../services/api"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

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
      console.error("Error fetching tasks", error)
    }
  }

  // Add Task
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

      setTasks([...tasks, res.data])
      setTitle("")

    } catch (error) {
      console.error("Error adding task", error)
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

      setTasks(tasks.filter((task) => task._id !== id))

    } catch (error) {
      console.error("Error deleting task", error)
    }
  }

  // Toggle Complete
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

      setTasks(
        tasks.map((t) =>
          t._id === task._id ? res.data : t
        )
      )

    } catch (error) {
      console.error("Error updating task", error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-6">
        TaskFlow Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* Add Task Section */}
        <div className="mb-6 flex gap-3">

          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <p>No tasks yet</p>
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

                <span className={task.completed ? "line-through text-gray-400" : ""}>
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
  )
}

export default Dashboard