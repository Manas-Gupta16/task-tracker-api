import { LayoutDashboard, CheckCircle, Clock, ListTodo, LogOut } from "lucide-react"

function Sidebar({ setFilter, logout }) {

  return (

    <div className="w-64 bg-gradient-to-b from-indigo-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 text-white min-h-screen p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold">TaskFlow</h2>
        <p className="text-sm opacity-80">Productivity Dashboard</p>
      </div>

      {/* Navigation */}
      <div className="space-y-3">

        <button
          onClick={() => setFilter("all")}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          onClick={() => setFilter("completed")}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20"
        >
          <CheckCircle size={18} />
          Completed Tasks
        </button>

        <button
          onClick={() => setFilter("pending")}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20"
        >
          <Clock size={18} />
          Pending Tasks
        </button>

        <button
          onClick={() => setFilter("all")}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20"
        >
          <ListTodo size={18} />
          All Tasks
        </button>

      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 p-3 bg-red-500 rounded-lg hover:bg-red-600"
      >
        <LogOut size={18}/>
        Logout
      </button>

    </div>

  )
}

export default Sidebar