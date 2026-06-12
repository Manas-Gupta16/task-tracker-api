import { useNavigate } from "react-router-dom"
import { useState, useCallback } from "react"
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
import useTaskForm from "../hooks/useTaskForm"
import useTaskTags from "../hooks/useTaskTags"

import {
  formatTime,
  getTaskStatus,
  getTimeRemaining,
  getPriorityStyle,
  formatPriority,
  getTagColor
} from "../utils/taskUtils"

function Dashboard() {

  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const [confetti, setConfetti] = useState(false)

  const [activeTag, setActiveTag] = useState(null)


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
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    priority,
    setPriority,
    category,
    setCategory,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    handleAddTask
  } = useTaskForm(
    addTask,
    setActiveTag
  )

  const {
    editingTask,
    setEditingTask,
    startEdit,
    handleSaveEdit
  } = useTaskEditing(saveEdit)

  const now = useTaskNotifications(tasks)

  // FIX #7: Precompute derived boolean for cleaner usage
  const allCompleted = tasks.every(t => t.completed)

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

  const allTags = useTaskTags(tasks)

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