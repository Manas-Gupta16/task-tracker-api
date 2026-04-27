import { LayoutDashboard, CheckCircle, Clock, ListTodo, LogOut } from "lucide-react"

function Sidebar({
  setFilter,
  logout,
  allTags = [],
  activeTag,
  setActiveTag,
  tasks = []   // ✅ default value prevents crash
}) {

  // ✅ Safe tag count
  const tasksCount = (tag) =>
    tasks?.filter(t => (t.tags || []).includes(tag)).length || 0

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
          onClick={() => {
            setFilter("all")
            setActiveTag(null)
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          onClick={() => {
            setFilter("completed")
            setActiveTag(null)
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition"
        >
          <CheckCircle size={18} />
          Completed Tasks
        </button>

        <button
          onClick={() => {
            setFilter("pending")
            setActiveTag(null)
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition"
        >
          <Clock size={18} />
          Pending Tasks
        </button>

        <button
          onClick={() => {
            setFilter("all")
            setActiveTag(null)
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition"
        >
          <ListTodo size={18} />
          All Tasks
        </button>

      </div>

      {/* Tags Section */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-white/70 mb-2">
          Tags
        </h3>

        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">

          {allTags.length === 0 && (
            <p className="text-xs text-white/50">No tags yet</p>
          )}

          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() =>
                setActiveTag(prev => (prev === tag ? null : tag))
              }
              className={`text-left px-3 py-2 rounded-lg text-sm transition flex justify-between items-center
                ${
                  activeTag === tag
                    ? "bg-white text-blue-600 font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }
              `}
            >
              <span>#{tag}</span>

              {/* ✅ Safe count display */}
              <span className="text-xs opacity-70">
                {tasksCount(tag)}
              </span>
            </button>
          ))}

        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 p-3 bg-red-500 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  )
}

export default Sidebar