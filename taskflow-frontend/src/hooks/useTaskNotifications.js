import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function useTaskNotifications(tasks) {

    const [now, setNow] =
        useState(Date.now())

    const [notifiedTasks, setNotifiedTasks] =
        useState(new Set())

    useEffect(() => {

        const interval = setInterval(() => {
            setNow(Date.now())
        }, 60000)

        return () => clearInterval(interval)

    }, [])

    useEffect(() => {

        tasks.forEach(task => {

            if (!task.endTime || task.completed)
                return

            const end =
                new Date(task.endTime).getTime()

            const diff = end - now

            const alreadyNotified =
                notifiedTasks.has(task._id)

            if (
                diff > 0 &&
                diff <= 60 * 60 * 1000 &&
                !alreadyNotified
            ) {

                toast(
                    `⏳ "${task.title}" is due soon!`
                )

                setNotifiedTasks(prev => {
                    const next = new Set(prev)
                    next.add(task._id)
                    return next
                })

            }

            if (
                diff <= 0 &&
                !alreadyNotified
            ) {

                toast.error(
                    `⚠️ "${task.title}" is overdue!`
                )

                setNotifiedTasks(prev => {
                    const next = new Set(prev)
                    next.add(task._id)
                    return next
                })

            }

        })

    }, [tasks, now, notifiedTasks])

    return now
}

export default useTaskNotifications