import { memo, useCallback } from "react"

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

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

                <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={handleToggle}
                />

                <div>

                    <div className="flex items-center gap-2">

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

                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {task.description}
                        </p>
                    )}

                    {(task.tags || []).length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">

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

                    <div className="text-sm flex gap-3 mt-1 items-center flex-wrap">

                        <span className={getPriorityStyle(task.priority)}>
                            {formatPriority(task.priority)}
                        </span>

                        {task.startTime && task.endTime && (
                            <span>
                                ⏰ {formatTime(task.startTime)} →{" "}
                                {formatTime(task.endTime)}
                            </span>
                        )}

                        {status && (
                            <span className={`font-semibold ${status.color}`}>

                                {status.label}

                                {task.endTime &&
                                    status.label !== "Overdue" && (
                                        <span className="ml-2 text-xs text-gray-400">
                                            ⏳ {getTimeRemaining(task.endTime, now)}
                                        </span>
                                    )}

                            </span>
                        )}

                    </div>

                </div>

            </div>

            <div className="flex gap-3">

                <button
                    onClick={handleEdit}
                    className="text-blue-600 hover:underline"
                >
                    Edit
                </button>

                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:underline"
                >
                    Delete
                </button>

            </div>

        </div>

    )

}

export default memo(TaskView)