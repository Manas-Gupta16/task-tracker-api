import { motion } from "framer-motion"

function Sidebar({ logout, totalTasks, completedTasks, pendingTasks }) {

  return (

    <div className="w-64 bg-gradient-to-b from-indigo-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 text-white min-h-screen p-6 shadow-xl">

      <h2 className="text-2xl font-bold mb-10">
        TaskFlow
      </h2>

      <div className="space-y-6">

        <div className="bg-white/20 p-4 rounded-xl text-center">
          <p className="text-sm">Total Tasks</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>

        <div className="bg-white/20 p-4 rounded-xl text-center">
          <p className="text-sm">Completed</p>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>

        <div className="bg-white/20 p-4 rounded-xl text-center">
          <p className="text-sm">Pending</p>
          <p className="text-2xl font-bold">{pendingTasks}</p>
        </div>

      </div>

      <button
        onClick={logout}
        className="mt-10 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
      >
        Logout
      </button>

    </div>
  )
}

export default Sidebar