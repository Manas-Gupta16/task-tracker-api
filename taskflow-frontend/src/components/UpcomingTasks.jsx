function UpcomingTasks({ tasks }) {

    const getDueText = (endTime) => {

        const now = new Date()

        const diff =
            new Date(endTime) - now

        const hours =
            Math.floor(diff / (1000 * 60 * 60))

        const days =
            Math.floor(hours / 24)

        if (days > 0)
            return `Due in ${days} day${days > 1 ? "s" : ""}`

        if (hours > 0)
            return `Due in ${hours} hour${hours > 1 ? "s" : ""}`

        return "Due soon"
    }

    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6">

            <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Upcoming Deadlines
            </h2>

            <div className="space-y-4">

                {tasks.map(task => (

                    <div
                        key={task._id}
                        className="border-b pb-3"
                    >

                        <h3 className="font-semibold dark:text-white">
                            {task.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {getDueText(task.endTime)}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default UpcomingTasks