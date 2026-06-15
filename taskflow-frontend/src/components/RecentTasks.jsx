import timeAgo from "../utils/timeAgo"

function RecentTasks({ tasks }) {

    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5">

            <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-semibold dark:text-white">
                    Recent Tasks
                </h2>

                <span className="text-sm text-gray-500">
                    {tasks.length}
                </span>

            </div>

            {tasks.length === 0 ? (

                <p className="text-gray-500">
                    No tasks yet
                </p>

            ) : (

                <div className="space-y-3">

                    {tasks.map(task => (

                        <div
                            key={task._id}
                            className="border-b border-gray-300 dark:border-gray-700 pb-2 last:border-none"
                        >

                            <h3 className="font-medium dark:text-white">
                                {task.title}
                            </h3>

                            <p className="text-sm text-gray-500">

                                {task.category}
                                {" • "}
                                {task.priority}
                                {" • "}
                                {timeAgo(task.createdAt)}

                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )

}

export default RecentTasks