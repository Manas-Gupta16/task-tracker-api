import { useMemo } from "react"

function useTaskTags(tasks) {

    return useMemo(() => {

        return [
            ...new Set(
                tasks.flatMap(
                    task => task.tags || []
                )
            )
        ]

    }, [tasks])

}

export default useTaskTags