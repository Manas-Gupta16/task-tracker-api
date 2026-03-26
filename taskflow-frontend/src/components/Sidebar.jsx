import { FaTasks, FaCheckCircle, FaSignOutAlt } from "react-icons/fa"

function Sidebar({ logout }) {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-6">

      <h1 className="text-2xl font-bold mb-10">
        TaskFlow
      </h1>

      <nav className="flex flex-col gap-6">

        <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">
          <FaTasks />
          <span>All Tasks</span>
        </div>

        <div className="flex items-center gap-3 hover:text-green-400 cursor-pointer">
          <FaCheckCircle />
          <span>Completed</span>
        </div>

      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-300"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  )
}

export default Sidebar