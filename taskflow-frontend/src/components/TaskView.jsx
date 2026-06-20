import { memo, useCallback } from "react"
import { useGlobalTasks } from "../context/TaskContext"
import { Play } from "lucide-react"

function TaskView({
    task,
    status,
    now,
    toggleComplete,
    activeTag,
    setActiveTag,
    getTagColor,
    getPriorityStyle,
    formatPriority,
    formatTime,
    getTimeRemaining,
    startEdit,
    deleteTask
}) {

    const { setActiveTimerTask, activeTimerTask } = useGlobalTasks()

    const handleToggle = useCallback(() => {
        toggleComplete(task)
    }, [toggleComplete, task])

    const handleEdit = useCallback(() => {
        startEdit(task)
    }, [startEdit, task])

    const handleDelete = useCallback(() => {
        deleteTask(task._id)
    }, [deleteTask, task._id])

    const handleTagClick = useCallback((tag) => {
        setActiveTag(prev =>
            prev === tag ? null : tag
        )
    }, [setActiveTag])

    const handleStartTimer = useCallback(() => {
        setActiveTimerTask(task)
    }, [setActiveTimerTask, task])

    const isTimerActive = activeTimerTask?._id === task._id

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-start gap-3 w-full pr-4">

                <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={handleToggle}
                    className="mt-1.5 w-4 h-4 cursor-pointer"
                />

                <div className="w-full">

                    <div className="flex items-center gap-2 flex-wrap">

                        <span
                            className={`font-medium ${task.status === "completed"
                                    ? "line-through text-gray-400"
                                    : "dark:text-white"
                                }`}
                        >
                            {task.title}
                        </span>

                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded capitalize">
                            {task.category}
                        </span>

                        {task.isRecurring && task.recurrencePattern !== "none" && (
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full flex items-center gap-1 capitalize">
                                🔁 {task.recurrencePattern}
                            </span>
                        )}

                        {task.timeSpent > 0 && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 rounded-full flex items-center gap-1">
                                ⏱️ {task.timeSpent} min
                            </span>
                        )}

                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                            {task.description}
                        </p>
                    )}

                    {(task.tags || []).length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">

                            {(task.tags || []).map((tag, index) => (

                                <span
                                    key={index}
                                    onClick={() => handleTagClick(tag)}
                                    className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium text-white transition capitalize
                                        ${activeTag === tag
                                            ? "bg-blue-700 scale-105"
                                            : getTagColor(tag)
                                        }
                                    `}
                                >
                                    #{tag}
                                </span>

                            ))}

                        </div>
                    )}

                    <div className="text-sm flex gap-3 mt-2 items-center flex-wrap">

                        <span className={getPriorityStyle(task.priority)}>
                            {formatPriority(task.priority)}
                        </span>

                        {task.startTime && task.endTime && (
                            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium flex items-center gap-1">
                                ⏰ {formatTime(task.startTime)} →{" "}
                                {formatTime(task.endTime)}
                            </span>
                        )}

                        {status && (
                            <span className={`font-semibold ${status.color} text-xs flex items-center`}>

                                {status.label}

                                {task.endTime &&
                                    status.label !== "Overdue" && (
                                        <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">
                                            ⏳ {getTimeRemaining(task.endTime, now)}
                                        </span>
                                    )}

                            </span>
                        )}

                    </div>

                </div>

            </div>

            <div className="flex flex-col gap-2 shrink-0 border-l border-gray-200 dark:border-gray-700 pl-4 py-1">
                
                <button
                    onClick={handleStartTimer}
                    disabled={isTimerActive || task.status === "completed"}
                    className={`text-xs px-3 py-1.5 rounded flex items-center justify-center gap-1 font-medium transition
                        ${isTimerActive 
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 cursor-not-allowed" 
                            : task.status === "completed"
                                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        }
                    `}
                    title="Start Pomodoro Timer"
                >
                    <Play size={14} className={isTimerActive ? "animate-pulse" : ""} />
                    {isTimerActive ? "Active" : "Timer"}
                </button>

                <button
                    onClick={handleEdit}
                    className="text-xs font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 px-3 py-1 bg-gray-50 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded transition"
                >
                    Edit
                </button>

                <button
                    onClick={handleDelete}
                    className="text-xs font-medium text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 px-3 py-1 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded transition"
                >
                    Delete
                </button>

            </div>

        </div>

    )

}

export default memo(TaskView)