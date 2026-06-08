import { useNavigate } from "react-router-dom"
import { useState, useMemo, useCallback } from "react"
import Confetti from "react-confetti"
import "react-datepicker/dist/react-datepicker.css"

import toast from "react-hot-toast"

import Sidebar from "../components/Sidebar"
import DarkModeToggle from "../components/DarkModeToggle"
import AddTaskForm from "../components/AddTaskForm"
import StatCard from "../components/StatCard"
import TaskList from "../components/TaskList"

import API from "../services/api"

//hooks
import useDebounce from "../hooks/useDebounce"
import useTasks from "../hooks/useTasks"
import useTaskNotifications from "../hooks/useTaskNotifications"
import useTaskFilters from "../hooks/useTaskFilters"
import useBulkComplete from "../hooks/useBulkComplete"
import useTaskEditing from "../hooks/useTaskEditing"

import {
  formatTime,
  getTaskStatus,
  getTimeRemaining,
  getPriorityStyle,
  formatPriority,
  getTagColor
} from "../utils/taskUtils"

function Dashboard() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [activeTag, setActiveTag] = useState(null)
  const [priority, setPriority] = useState("medium")
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)

  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const [confetti, setConfetti] = useState(false)

  const [category, setCategory] = useState("personal")


  const navigate = useNavigate()

  const {
    tasks,
    stats,
    setTasks,
    fetchStats,
    addTask,
    deleteTask,
    toggleComplete,
    saveEdit
  } = useTasks()

  const {
    editingTask,
    setEditingTask,
    startEdit,
    handleSaveEdit
  } = useTaskEditing(saveEdit)

  const now = useTaskNotifications(tasks)

  // FIX #7: Precompute derived boolean for cleaner usage
  const allCompleted = tasks.every(t => t.completed)

  // FIX #5: Extracted resetForm helper to avoid duplicate reset logic
  const resetForm = useCallback(() => {
    setTitle("")
    setDescription("")
    setTags("")
    setPriority("medium")
    setCategory("personal")
    setStartTime(null)
    setEndTime(null)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const {
    bulkLoading,
    markAllCompleted
  } = useBulkComplete(
    tasks,
    setTasks,
    fetchStats,
    setConfetti
  )

  // FIX #8: Memoized allTags to avoid recalculating on every render
  const allTags = useMemo(() =>
    [...new Set(tasks.flatMap(task => task.tags || []))],
    [tasks]
  )

  const filteredTasks = useTaskFilters(
    tasks,
    filter,
    debouncedSearch,
    activeTag
  )

  const handleToggleComplete = useCallback(
    (task) => {
      toggleComplete(task, setConfetti)
    },
    [toggleComplete]
  )

  const handleAddTask = useCallback(() => {

    addTask(
      {
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
      },
      resetForm,
      setActiveTag
    )

  }, [
    addTask,
    title,
    description,
    tags,
    priority,
    category,
    startTime,
    endTime,
    resetForm,
    setActiveTag
  ])

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

          addTask={handleAddTask}

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
          saveEdit={handleSaveEdit}
          startEdit={startEdit}
          deleteTask={deleteTask}
          toggleComplete={handleToggleComplete}
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
