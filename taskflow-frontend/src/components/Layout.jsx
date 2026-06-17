import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import DarkModeToggle from "./DarkModeToggle";
import AddTaskModal from "./AddTaskModal";
import { useGlobalTasks } from "../context/TaskContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);

  const { allTags, tasks } = useGlobalTasks();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black">
      <Sidebar
        logout={logout}
        allTags={allTags}
        activeTag={activeTag}
        setActiveTag={(tag) => {
          setActiveTag(tag);
          if (currentPath !== '/tasks') {
            navigate('/tasks');
          }
        }}
        tasks={tasks}
        currentPath={currentPath}
        openNewTaskModal={() => setIsModalOpen(true)}
      />
      
      <DarkModeToggle />

      <main className="flex-1 p-10 overflow-y-auto max-h-screen relative">
        <Outlet context={{ activeTag, setActiveTag, openNewTaskModal: () => setIsModalOpen(true) }} />
      </main>

      {/* Global Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl relative my-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Create New Task</h2>
              <AddTaskModal closeModal={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
