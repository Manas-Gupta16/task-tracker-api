import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import Confetti from "react-confetti";
import TaskList from "../components/TaskList";
import KanbanBoard from "../components/KanbanBoard";
import { useGlobalTasks } from "../context/TaskContext";

// hooks
import useDebounce from "../hooks/useDebounce";
import useTaskFilters from "../hooks/useTaskFilters";
import useTaskEditing from "../hooks/useTaskEditing";
import useTaskNotifications from "../hooks/useTaskNotifications";

import {
  formatTime,
  getTaskStatus,
  getTimeRemaining,
  getPriorityStyle,
  formatPriority,
  getTagColor
} from "../utils/taskUtils";

function TasksPage() {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("board");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [confetti, setConfetti] = useState(false);

  const { activeTag, setActiveTag, openNewTaskModal } = useOutletContext();

  const {
    tasks,
    deleteTask,
    toggleComplete,
    saveEdit,
    bulkLoading,
    markAllCompleted
  } = useGlobalTasks();

  const {
    editingTask,
    setEditingTask,
    startEdit,
    handleSaveEdit
  } = useTaskEditing(saveEdit);

  const now = useTaskNotifications(tasks);
  const allCompleted = tasks.length > 0 && tasks.every(t => t.status === "completed");

  const filteredTasks = useTaskFilters(
    tasks,
    filter,
    debouncedSearch,
    activeTag
  );

  const handleToggleComplete = useCallback(
    (task) => {
      toggleComplete(task, setConfetti);
    },
    [toggleComplete]
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      {confetti && <Confetti recycle={false} numberOfPieces={200} />}

      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">All Tasks</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage, filter, and track your progress.</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={markAllCompleted}
              disabled={bulkLoading || allCompleted || tasks.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm
                ${(bulkLoading || allCompleted || tasks.length === 0)
                  ? "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"}
              `}
            >
              {bulkLoading ? "Completing..." : "Complete All"}
            </button>
            <button
              onClick={openNewTaskModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm md:hidden"
            >
              New Task
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 w-full md:w-auto overflow-x-auto">
            {['all', 'pending', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition whitespace-nowrap
                  ${filter === f 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}
                `}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border border-gray-300 p-2.5 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
            />
          </div>

          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 w-full md:w-auto">
            {['list', 'board'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition
                  ${view === v 
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" 
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}
                `}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      {activeTag && (
        <div className="mb-6 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg w-fit border border-indigo-100 dark:border-indigo-800">
          <span className="text-sm capitalize">
            Filtering by: <b>#{activeTag}</b>
          </span>
          <button
            onClick={() => setActiveTag(null)}
            className="hover:bg-indigo-200 dark:hover:bg-indigo-800 p-1 rounded-md transition"
            title="Clear filter"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      {view === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <TaskList
            filteredTasks={filteredTasks}
            getTaskStatus={getTaskStatus}
            now={now}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            saveEdit={handleSaveEdit}
            startEdit={startEdit}
            deleteTask={deleteTask}
            toggleComplete={handleToggleComplete}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            getTagColor={getTagColor}
            getPriorityStyle={getPriorityStyle}
            formatPriority={formatPriority}
            formatTime={formatTime}
            getTimeRemaining={getTimeRemaining}
          />
        </div>
      ) : (
        <KanbanBoard
          filteredTasks={filteredTasks}
          getTaskStatus={getTaskStatus}
          now={now}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          saveEdit={handleSaveEdit}
          startEdit={startEdit}
          deleteTask={deleteTask}
          toggleComplete={handleToggleComplete}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          getTagColor={getTagColor}
          getPriorityStyle={getPriorityStyle}
          formatPriority={formatPriority}
          formatTime={formatTime}
          getTimeRemaining={getTimeRemaining}
        />
      )}
    </div>
  );
}

export default TasksPage;
