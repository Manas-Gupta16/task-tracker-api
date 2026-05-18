import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import {
    fetchTasksService,
    fetchStatsService,
    addTaskService,
    deleteTaskService,
    updateTaskService
} from "../services/taskService"

function useTasks() {

    const [tasks, setTasks] = useState([])

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        overdue: 0
    })

    useEffect(() => {
        fetchTasks()
        fetchStats()
    }, [])

    const fetchTasks = async () => {

        try {

            const data = await fetchTasksService()

            setTasks(data)

        } catch {

            toast.error("Failed to fetch tasks")

        }

    }

    const fetchStats = async () => {

        try {

            const data = await fetchStatsService()

            setStats(data)

        } catch (err) {

            console.error(err)

            toast.error("Failed to fetch stats")

        }

    }

    const addTask = async (taskData, resetForm, setActiveTag) => {

        if (!taskData.title.trim()) {
            toast.error("Task cannot be empty")
            return
        }

        try {

            const newTask = await addTaskService(taskData)

            setTasks(prev => [newTask, ...prev])

            fetchStats()

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
                prev.filter(task => task._id !== id)
            )

            fetchStats()

            toast.success("Task deleted")

        } catch (err) {

            console.error(err)

            toast.error("Error deleting task")

        }

    }

    const toggleComplete = async (
        task,
        setConfetti
    ) => {

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

    const saveEdit = async (
        editingTask,
        setEditingTask
    ) => {

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

                startTime:
                    editingTask.startTime?.toISOString(),

                endTime:
                    editingTask.endTime?.toISOString()
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

    return {
    tasks,
    stats,
    setTasks,
    fetchStats,
    addTask,
    deleteTask,
    toggleComplete,
    saveEdit
}

}

export default useTasks