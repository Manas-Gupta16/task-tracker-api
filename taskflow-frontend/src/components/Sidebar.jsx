import { LayoutDashboard, CheckCircle, Clock, ListTodo, LogOut, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar({
  logout,
  allTags = [],
  activeTag,
  setActiveTag,
  tasks = [],
  currentPath,
  openNewTaskModal,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) {

  // Safe tag count
  const tasksCount = (tag) =>
    tasks?.filter(t => (t.tags || []).includes(tag)).length || 0;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 shrink-0
        bg-gradient-to-b from-indigo-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 
        text-white p-6 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo and Mobile Close */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="text-blue-300" />
            TaskFlow
          </h2>
          <button 
            className="md:hidden text-indigo-200 hover:text-white p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

      <button
        onClick={openNewTaskModal}
        className="w-full mb-8 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        <Plus size={20} />
        New Task
      </button>

      {/* Navigation */}
      <div className="space-y-2 mb-8">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-3">
          Views
        </h3>

        <Link
          to="/dashboard"
          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors font-medium
            ${currentPath === '/dashboard' ? 'bg-white/20 text-white shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'}
          `}
        >
          <LayoutDashboard size={18} />
          Overview
        </Link>

        <Link
          to="/tasks"
          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors font-medium
            ${currentPath === '/tasks' ? 'bg-white/20 text-white shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'}
          `}
        >
          <ListTodo size={18} />
          All Tasks
        </Link>
      </div>

      {/* Tags Section */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-3 flex items-center justify-between">
          <span>Tags</span>
        </h3>

        <div className="flex flex-col gap-1 pr-1">
          {allTags.length === 0 && (
            <p className="text-xs text-white/50 px-3">No tags yet</p>
          )}

          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => setActiveTag(prev => (prev === tag ? null : tag))}
              className={`text-left px-3 py-2 rounded-lg text-sm transition flex justify-between items-center group capitalize
                ${
                  activeTag === tag
                    ? "bg-white text-indigo-600 font-semibold shadow-sm"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className="truncate">#{tag}</span>

              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTag === tag ? 'bg-indigo-100 text-indigo-700' : 'bg-white/10 text-white/70 group-hover:bg-white/20'}`}>
                {tasksCount(tag)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="pt-6 mt-6 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 text-indigo-100 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>

      </div>
    </>
  );
}

export default Sidebar;