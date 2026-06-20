import { TaskItemSkeleton } from "./LoadingSkeletons"

function UpcomingTasks({ tasks, isLoading }) {

    const getDueText = (endTime) => {

        const now = new Date()

        const diff =
            new Date(endTime) - now

        const hours =
            Math.floor(diff / (1000 * 60 * 60))

        const days =
            Math.floor(hours / 24)

        if (days > 0)
            return `${days}d`

        if (hours > 0)
            return `${hours}h`

        return "soon"
    }

    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5">

            <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-semibold dark:text-white">
                    Upcoming Deadlines
                </h2>

                <span className="text-sm text-gray-500">
                    {!isLoading && tasks.length}
                </span>

            </div>

            {isLoading ? (
                <div className="space-y-3">
                    <TaskItemSkeleton />
                    <TaskItemSkeleton />
                    <TaskItemSkeleton />
                </div>
            ) : tasks.length === 0 ? (

                <p className="text-gray-500">
                    No upcoming deadlines
                </p>

            ) : (

                <div className="space-y-3">

                    {tasks.map(task => (

                        <div
                            key={task._id}
                            className="flex justify-between border-b border-gray-300 dark:border-gray-700 pb-2 last:border-none"
                        >

                            <span className="dark:text-white">
                                {task.title}
                            </span>

                            <span className="text-gray-500">
                                {getDueText(task.endTime)}
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}

export default UpcomingTasks