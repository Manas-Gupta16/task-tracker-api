import React from "react"
import { AnimatePresence } from "framer-motion"

import TaskCard from "./TaskCard"

const TaskList = React.memo(function TaskList({
    filteredTasks,
    getTaskStatus,
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

    console.log("TaskList render")

    return (

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

            <AnimatePresence>

                {filteredTasks.map((task) => {

                    const status = getTaskStatus(task, now)

                    return (

                        <TaskCard
                            key={task._id}
                            task={task}
                            status={status}
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

                    )

                })}

            </AnimatePresence>

            {filteredTasks.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No tasks found
                </p>
            )}

        </div>

    )

})

export default TaskList