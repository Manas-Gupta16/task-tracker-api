import { motion } from "framer-motion"
import DatePicker from "react-datepicker"

function TaskCard({
    task,
    status,
    editingTask,
    setEditingTask,
    saveEdit,
    startEdit,
    deleteTask,
    toggleComplete,
    activeTag,
    setActiveTag,
    getTagColor,
    getPriorityStyle,
    formatPriority,
    formatTime,
    getTimeRemaining
}) {

    return (

        <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`border p-4 mb-3 rounded-lg dark:border-gray-600
        ${status?.label === "Overdue"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : status?.label === "Due Soon"
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                        : ""
                }
      `}
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

                    <input
                        value={editingTask.tags}
                        onChange={(e) =>
                            setEditingTask({ ...editingTask, tags: e.target.value })
                        }
                        className="border p-2 rounded"
                        placeholder="Tags (comma separated)"
                    />

                    <select
                        value={editingTask.category}
                        onChange={(e) =>
                            setEditingTask({ ...editingTask, category: e.target.value })
                        }
                        className="border p-2 rounded"
                    >
                        <option value="work">Work</option>
                        <option value="study">Study</option>
                        <option value="personal">Personal</option>
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

                            <div className="flex items-center gap-2">

                                <span className={`font-medium ${task.completed ? "line-through text-gray-400" : "dark:text-white"}`}>
                                    {task.title}
                                </span>

                                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
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
                                            onClick={() =>
                                                setActiveTag(prev => prev === tag ? null : tag)
                                            }
                                            className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium text-white transition
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

                                        {task.endTime && status.label !== "Overdue" && (
                                            <span className="ml-2 text-xs text-gray-400">
                                                ⏳ {getTimeRemaining(task.endTime)}
                                            </span>
                                        )}

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

}

export default TaskCard