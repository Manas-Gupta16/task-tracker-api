import { useState, useCallback } from "react"
import toast from "react-hot-toast"

import API from "../services/api"

function useBulkComplete(
    tasks,
    setTasks,
    fetchStats,
    setConfetti
) {

    const [bulkLoading, setBulkLoading] =
        useState(false)

    const markAllCompleted =
        useCallback(async () => {

            try {

                setBulkLoading(true)

                const token =
                    localStorage.getItem("token")

                const incompleteTasks =
                    tasks.filter(
                        task => task.status !== "completed"
                    )

                if (incompleteTasks.length === 0) {

                    toast(
                        "All tasks already completed"
                    )

                    return
                }

                const updatedResponses =
                    await Promise.all(

                        incompleteTasks.map(task =>
                            API.put(
                                `/tasks/${task._id}`,
                                { status: "completed" },
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                }
                            )
                        )

                    )

                const updatedTasksMap =
                    new Map(
                        updatedResponses.map(res => [
                            res.data._id,
                            res.data
                        ])
                    )

                setTasks(prev =>
                    prev.map(task =>
                        updatedTasksMap.get(task._id)
                        || task
                    )
                )

                await fetchStats()

                setConfetti(true)

                setTimeout(() => {
                    setConfetti(false)
                }, 2000)

                toast.success(
                    "All tasks completed 🚀"
                )

            } catch (err) {

                console.error(err)

                toast.error(
                    "Failed to update tasks"
                )

            } finally {

                setBulkLoading(false)

            }

        }, [
            tasks,
            setTasks,
            fetchStats,
            setConfetti
        ])

    return {
        bulkLoading,
        markAllCompleted
    }

}

export default useBulkComplete