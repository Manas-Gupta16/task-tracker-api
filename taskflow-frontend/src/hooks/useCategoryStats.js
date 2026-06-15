import { useMemo } from "react"

function useCategoryStats(tasks) {

    return useMemo(() => {

        const stats = {
            study: 0,
            personal: 0,
            work: 0
        }

        tasks.forEach(task => {

            if (stats[task.category] !== undefined) {
                stats[task.category]++
            }

        })

        return stats

    }, [tasks])

}

export default useCategoryStats