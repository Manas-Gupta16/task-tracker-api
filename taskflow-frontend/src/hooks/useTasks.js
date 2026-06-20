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
    const [isLoading, setIsLoading] = useState(true)
    const [isStatsLoading, setIsStatsLoading] = useState(true)

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
            setIsLoading(true)
            const data = await fetchTasksService()
            setTasks(data)
        } catch {
            toast.error("Failed to fetch tasks")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            setIsStatsLoading(true)
            const data = await fetchStatsService()
            setStats(data)
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch stats")
        } finally {
            setIsStatsLoading(false)
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
                { status: task.status === "completed" ? "pending" : "completed" }
            )

            setTasks(prev =>
                prev.map(t =>
                    t._id === task._id
                        ? updatedTask
                        : t
                )
            )

            fetchStats()

            if (task.status !== "completed") {

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

    const updateTaskStatus = async (task, newStatus) => {
        try {
            const updatedTask = await updateTaskService(
                task._id,
                { status: newStatus }
            )
            setTasks(prev =>
                prev.map(t => t._id === task._id ? updatedTask : t)
            )
            fetchStats()
        } catch (err) {
            console.error(err)
            toast.error("Error updating task status")
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
                        .map(t => t.trim())
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

    const updateTaskTime = async (taskId, newTimeSpent) => {
        try {
            const updatedTask = await updateTaskService(taskId, { timeSpent: newTimeSpent })
            setTasks(prev =>
                prev.map(t =>
                    t._id === taskId ? updatedTask : t
                )
            )
        } catch (err) {
            console.error(err)
            toast.error("Failed to save tracked time")
        }
    }

    return {
        tasks,
        stats,
        isLoading,
        isStatsLoading,
        setTasks,
        fetchStats,
        addTask,
        deleteTask,
        toggleComplete,
        updateTaskStatus,
        updateTaskTime,
        saveEdit
    }

}

export default useTasks