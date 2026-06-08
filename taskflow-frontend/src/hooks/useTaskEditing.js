import { useState, useCallback } from "react"

function useTaskEditing(saveEdit) {

    const [editingTask, setEditingTask] =
        useState(null)

    const startEdit = useCallback((task) => {

        setEditingTask({
            _id: task._id,
            title: task.title,
            description: task.description || "",
            tags: task.tags
                ? task.tags.join(", ")
                : "",
            priority: task.priority,
            category: task.category,
            startTime: task.startTime
                ? new Date(task.startTime)
                : null,
            endTime: task.endTime
                ? new Date(task.endTime)
                : null
        })

    }, [])

    const handleSaveEdit = useCallback(() => {

        saveEdit(
            editingTask,
            setEditingTask
        )

    }, [
        saveEdit,
        editingTask
    ])

    return {
        editingTask,
        setEditingTask,
        startEdit,
        handleSaveEdit
    }

}

export default useTaskEditing