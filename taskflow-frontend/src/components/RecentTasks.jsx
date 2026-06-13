import timeAgo from "../utils/timeAgo"

function RecentTasks({ tasks }) {

    if (tasks.length === 0) {

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6">

                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    Recent Tasks
                </h2>

                <p className="text-gray-500">
                    No tasks yet
                </p>

            </div>
        )

    }

    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6">

            <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Recent Tasks
            </h2>

            <div className="space-y-4">

                {tasks.map(task => (

                    <div
                        key={task._id}
                        className="border-b border-gray-300 dark:border-gray-700 pb-3 last:border-none"
                    >

                        <h3 className="font-medium text-lg dark:text-white">
                            {task.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Category: {task.category}
                        </p>

                        <p className="text-sm text-gray-500">
                            Priority: {task.priority}
                        </p>

                        <p className="text-sm text-gray-500">
                            Created: {timeAgo(task.createdAt)}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default RecentTasks