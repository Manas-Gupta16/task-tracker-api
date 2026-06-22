import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, CheckCircle } from "lucide-react";
import Sidebar from "./Sidebar";
import DarkModeToggle from "./DarkModeToggle";
import AddTaskModal from "./AddTaskModal";
import PomodoroTimer from "./PomodoroTimer";
import { useGlobalTasks } from "../context/TaskContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { allTags, tasks } = useGlobalTasks();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const currentPath = location.pathname;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-indigo-600 dark:bg-gray-800 text-white sticky top-0 z-30 shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle className="text-blue-300" />
          TaskFlow
        </h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
      </div>

      <Sidebar
        logout={logout}
        allTags={allTags}
        activeTag={activeTag}
        setActiveTag={(tag) => {
          setActiveTag(tag);
          setIsMobileMenuOpen(false); // Close menu on mobile after selection
          if (currentPath !== '/tasks') {
            navigate('/tasks');
          }
        }}
        tasks={tasks}
        currentPath={currentPath}
        openNewTaskModal={() => {
          setIsModalOpen(true);
          setIsMobileMenuOpen(false); // Close menu when opening modal
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <DarkModeToggle />

      <main className="flex-1 p-4 md:p-10 overflow-x-hidden overflow-y-auto md:max-h-screen relative w-full">
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

      <PomodoroTimer />
    </div>
  );
}

export default Layout;
