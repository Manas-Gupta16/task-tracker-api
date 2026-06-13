import { useMemo } from "react"

function useRecentTasks(tasks) {

    return useMemo(() => {

        return [...tasks]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 5)

    }, [tasks])

}

export default useRecentTasks