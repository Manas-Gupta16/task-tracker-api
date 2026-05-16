import { useNavigate } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import Confetti from "react-confetti"
import "react-datepicker/dist/react-datepicker.css"

import {
  fetchTasksService,
  fetchStatsService,
  addTaskService,
  deleteTaskService,
  updateTaskService
} from "../services/taskService"
import API from "../services/api"
import toast from "react-hot-toast"

import Sidebar from "../components/Sidebar"
import DarkModeToggle from "../components/DarkModeToggle"
import AddTaskForm from "../components/AddTaskForm"
import StatCard from "../components/StatCard"
import TaskList from "../components/TaskList"

import {
  formatTime,
  getTaskStatus,
  getTimeRemaining,
  getPriorityStyle,
  formatPriority,
  getTagColor
} from "../utils/taskUtils"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [activeTag, setActiveTag] = useState(null)
  const [priority, setPriority] = useState("medium")
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [confetti, setConfetti] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  const [now, setNow] = useState(Date.now())
  const [notifiedTasks, setNotifiedTasks] = useState(new Set())
  const [category, setCategory] = useState("personal")

  const navigate = useNavigate()

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    overdue: 0
  })

  // FIX #7: Precompute derived boolean for cleaner usage
  const allCompleted = tasks.every(t => t.completed)

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // FIX #3: Added notifiedTasks to dependency array to avoid stale closure bug
  useEffect(() => {
    tasks.forEach(task => {

      if (!task.endTime || task.completed) return

      const end = new Date(task.endTime).getTime()
      const diff = end - now

      const alreadyNotified = notifiedTasks.has(task._id)

      if (diff > 0 && diff <= 60 * 60 * 1000 && !alreadyNotified) {
        toast(`⏳ "${task.title}" is due soon!`)

        // FIX #4: Safe Set mutation — create new Set instead of mutating
        setNotifiedTasks(prev => {
          const newSet = new Set(prev)
          newSet.add(task._id)
          return newSet
        })
      }

      if (diff <= 0 && !alreadyNotified) {
        toast.error(`⚠️ "${task.title}" is overdue!`)

        // FIX #4: Safe Set mutation — create new Set instead of mutating
        setNotifiedTasks(prev => {
          const newSet = new Set(prev)
          newSet.add(task._id)
          return newSet
        })
      }

    })
  }, [now, tasks, notifiedTasks])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const fetchTasks = async () => {

    try {

      const data = await fetchTasksService()

      setTasks(data)

    } catch {

      toast.error("Failed to fetch tasks")

    }

  }

  // FIX #5: Extracted resetForm helper to avoid duplicate reset logic
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setTags("")
    setPriority("medium")
    setCategory("personal")
    setStartTime(null)
    setEndTime(null)
  }

  const addTask = async () => {

    if (!title.trim()) {
      toast.error("Task cannot be empty")
      return
    }

    try {


      const newTask = await addTaskService({
        title,
        description,
        tags: [...new Set(
          tags
            .split(",")
            .map(t => t.trim().toLowerCase())
            .filter(Boolean)
        )],
        priority,
        category,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString()
      })

      setTasks(prev => [newTask, ...prev])
      fetchStats()

      // FIX #5: Use resetForm() instead of repeating state resets
      resetForm()
      setActiveTag(null)

      toast.success("Task added")

    } catch (err) {
      console.error(err)
      toast.error("Error adding task")
    }

  }

  const deleteTask = async (id) => {

    try {

      await deleteTaskService(id)

      setTasks(prev =>
        prev.filter(t => t._id !== id)
      )

      fetchStats()

      toast.success("Task deleted")

    } catch (err) {

      console.error(err)
      toast.error("Error deleting task")

    }

  }

  const fetchStats = async () => {

    try {

      const data = await fetchStatsService()

      setStats(data)

    } catch (err) {

      console.error(err)
      toast.error("Failed to fetch tasks")

    }

  }

  const toggleComplete = async (task) => {

    try {

      const updatedTask = await updateTaskService(
        task._id,
        { completed: !task.completed }
      )

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id
            ? updatedTask
            : t
        )
      )

      fetchStats()

      if (!task.completed) {

        setConfetti(true)

        setTimeout(() => {
          setConfetti(false)
        }, 2000)

      }

    } catch (err) {

      console.error(err)
      toast.error("Error updating task")

    }

  }

  const startEdit = (task) => {

    setEditingTask({
      _id: task._id,
      title: task.title,
      description: task.description || "",
      tags: task.tags ? task.tags.join(", ") : "",
      priority: task.priority,
      category: task.category,
      startTime: task.startTime ? new Date(task.startTime) : null,
      endTime: task.endTime ? new Date(task.endTime) : null
    })

  }

  const saveEdit = async () => {

    try {

      const updatedTask = {
        title: editingTask.title,
        description: editingTask.description,
        tags: editingTask.tags
          ? editingTask.tags
            .split(",")
            .map(t => t.trim().toLowerCase())
            .filter(Boolean)
          : [],
        priority: editingTask.priority,
        category: editingTask.category,
        startTime: editingTask.startTime?.toISOString(),
        endTime: editingTask.endTime?.toISOString()
      }

      const updatedData = await updateTaskService(
        editingTask._id,
        updatedTask
      )

      setTasks(prev =>
        prev.map(t =>
          t._id === editingTask._id
            ? updatedData
            : t
        )
      )

      setEditingTask(null)

      fetchStats()

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

      fetchStats()

      setConfetti(true)
      setTimeout(() => setConfetti(false), 2000)

      toast.success("All tasks completed 🚀")

    } catch (err) {
      console.error(err)
      toast.error("Failed to update stats")
    } finally {
      setBulkLoading(false)
    }
  }

  // FIX #8: Memoized allTags to avoid recalculating on every render
  const allTags = useMemo(() =>
    [...new Set(tasks.flatMap(task => task.tags || []))],
    [tasks]
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {

      const matchesFilter =
        filter === "completed"
          ? task.completed
          : filter === "pending"
            ? !task.completed
            : true

      const matchesSearch =
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (task.tags || []).some(tag =>
          tag.toLowerCase().includes(debouncedSearch.toLowerCase())
        )

      const matchesTag =
        !activeTag ||
        (task.tags || []).some(tag =>
          tag.toLowerCase() === activeTag.toLowerCase()
        )

      return matchesFilter && matchesSearch && matchesTag
    })
  }, [tasks, filter, debouncedSearch, activeTag])

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black">

      {confetti && <Confetti />}

      <Sidebar
        setFilter={setFilter}
        logout={logout}
        allTags={allTags}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        tasks={tasks}
      />
      <DarkModeToggle />

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          TaskFlow Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Tasks" value={stats.total} />
          <StatCard title="Completed" value={stats.completed} color="text-green-600" />
          <StatCard title="Pending" value={stats.pending} color="text-red-500" />
          <StatCard title="High Priority" value={stats.highPriority} color="text-orange-500" />
          <StatCard title="Overdue" value={stats.overdue} color="text-red-600" />
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
        <AddTaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          addTask={addTask}
          markAllCompleted={markAllCompleted}
          bulkLoading={bulkLoading}
          allCompleted={allCompleted}
        />


        {activeTag && (
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm dark:text-white">
              Filtering by: <b>#{activeTag}</b>
            </span>

            <button
              onClick={() => setActiveTag(null)}
              className="text-red-500 text-sm hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        <TaskList
          filteredTasks={filteredTasks}
          getTaskStatus={getTaskStatus}
          now={now}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          saveEdit={saveEdit}
          startEdit={startEdit}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          getTagColor={getTagColor}
          getPriorityStyle={getPriorityStyle}
          formatPriority={formatPriority}
          formatTime={formatTime}
          getTimeRemaining={getTimeRemaining}
        />

      </div>

    </div>

  )

}

export default Dashboard
