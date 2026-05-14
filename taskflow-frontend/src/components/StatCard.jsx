function StatCard({ title, value, color }) {

    return (

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">

            <h3 className="text-gray-500 dark:text-gray-300">
                {title}
            </h3>

            <p className={`text-3xl font-bold ${color || "dark:text-white"}`}>
                {value}
            </p>

        </div>

    )

}

export default StatCard