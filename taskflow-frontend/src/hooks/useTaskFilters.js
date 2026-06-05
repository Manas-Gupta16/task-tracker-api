import { useMemo } from "react"

function useTaskFilters(
    tasks,
    filter,
    search,
    activeTag
) {

    return useMemo(() => {

        return tasks.filter(task => {

            const matchesFilter =
                filter === "completed"
                    ? task.completed
                    : filter === "pending"
                        ? !task.completed
                        : true

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                (task.tags || []).some(tag =>
                    tag
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )

            const matchesTag =
                !activeTag ||

                (task.tags || []).some(tag =>
                    tag.toLowerCase() ===
                    activeTag.toLowerCase()
                )

            return (
                matchesFilter &&
                matchesSearch &&
                matchesTag
            )

        })

    }, [tasks, filter, search, activeTag])

}

export default useTaskFilters