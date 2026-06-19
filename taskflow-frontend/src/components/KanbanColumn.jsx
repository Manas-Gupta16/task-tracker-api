import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ 
  id, 
  title, 
  tasks, 
  getTaskStatus,
  now,
  editingTask,
  setEditingTask,
  saveEdit,
  startEdit,
  deleteTask,
  toggleComplete,
  activeTag,
  setActiveTag,
  getTagColor,
  getPriorityStyle,
  formatPriority,
  formatTime,
  getTimeRemaining 
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`flex flex-col bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 min-h-[500px] transition-colors ${isOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}>
      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 px-2">{title} <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{tasks.length}</span></h3>
      
      <div ref={setNodeRef} className="flex-1 flex flex-col gap-2">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard
              key={task._id}
              task={task}
              status={getTaskStatus(task, now)}
              now={now}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              saveEdit={saveEdit}
              startEdit={startEdit}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              activeTag={activeTag}
              setActiveTag={setActiveTag}
              getTagColor={getTagColor}
              getPriorityStyle={getPriorityStyle}
              formatPriority={formatPriority}
              formatTime={formatTime}
              getTimeRemaining={getTimeRemaining}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
