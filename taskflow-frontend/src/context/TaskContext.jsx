import { createContext, useContext, useState } from "react";
import useTasks from "../hooks/useTasks";
import useTaskTags from "../hooks/useTaskTags";
import useBulkComplete from "../hooks/useBulkComplete";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  // Use existing hooks to manage the global state
  const taskData = useTasks();
  
  // Also provide global tags
  const allTags = useTaskTags(taskData.tasks);
  
  // Provide bulk complete globally
  // Note: we can pass a dummy setConfetti here, or handle confetti in the layout
  // We'll just provide the raw hook output and components can use it
  const { bulkLoading, markAllCompleted } = useBulkComplete(
    taskData.tasks,
    taskData.setTasks,
    taskData.fetchStats,
    () => {} // dummy setConfetti for bulk action
  );

  // Timer state
  const [activeTimerTask, setActiveTimerTask] = useState(null);

  const value = {
    ...taskData,
    allTags,
    bulkLoading,
    markAllCompleted,
    activeTimerTask,
    setActiveTimerTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useGlobalTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useGlobalTasks must be used within a TaskProvider");
  }
  return context;
}
