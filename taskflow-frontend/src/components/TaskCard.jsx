import React from "react"
import { motion } from "framer-motion"

import TaskEditForm from "./TaskEditForm"
import TaskView from "./TaskView"

const TaskCard = React.memo(function TaskCard({
    task,
    status,
    now,
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

    console.log("TaskCard render:", task.title)

    return (

        <motion.div
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

                <TaskEditForm
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    saveEdit={saveEdit}
                />

            ) : (

                <TaskView
                    task={task}
                    status={status}
                    now={now}
                    toggleComplete={toggleComplete}
                    activeTag={activeTag}
                    setActiveTag={setActiveTag}
                    getTagColor={getTagColor}
                    getPriorityStyle={getPriorityStyle}
                    formatPriority={formatPriority}
                    formatTime={formatTime}
                    getTimeRemaining={getTimeRemaining}
                    startEdit={startEdit}
                    deleteTask={deleteTask}
                />

            )}

        </motion.div>

    )

})

export default TaskCard