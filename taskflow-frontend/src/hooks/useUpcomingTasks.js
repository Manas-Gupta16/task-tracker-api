import { useMemo } from "react"

function useUpcomingTasks(tasks) {

    return useMemo(() => {

        const now = new Date()

        return tasks
            .filter(task =>
                task.endTime &&
                !task.completed &&
                new Date(task.endTime) > now
            )
            .sort(
                (a, b) =>
                    new Date(a.endTime) -
                    new Date(b.endTime)
            )
            .slice(0, 5)

    }, [tasks])

}

export default useUpcomingTasks