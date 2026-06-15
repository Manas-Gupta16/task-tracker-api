function CategoryStats({ stats }) {

    return (

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5">

            <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Category Statistics
            </h2>

            <div className="space-y-3">

                <div className="flex justify-between dark:text-white">
                    <span>Study</span>
                    <span>{stats.study}</span>
                </div>

                <div className="flex justify-between dark:text-white">
                    <span>Personal</span>
                    <span>{stats.personal}</span>
                </div>

                <div className="flex justify-between dark:text-white">
                    <span>Work</span>
                    <span>{stats.work}</span>
                </div>

            </div>

        </div>

    )

}

export default CategoryStats