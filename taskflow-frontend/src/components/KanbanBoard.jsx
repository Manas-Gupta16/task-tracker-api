import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import { useGlobalTasks } from "../context/TaskContext";

import { KanbanColumnSkeleton } from "./LoadingSkeletons";

export default function KanbanBoard({
  filteredTasks,
  isLoading,
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
  getTimeRemaining,
}) {
  const { updateTaskStatus } = useGlobalTasks();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
      </div>
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum drag distance before firing
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const task = filteredTasks.find((t) => t._id === activeId);
    if (!task) return;

    const isCurrentlyStatus = task.status;
    
    // Determine the destination column
    let destinationStatus = null;
    
    if (overId === "col-pending") {
      destinationStatus = "pending";
    } else if (overId === "col-in-progress") {
      destinationStatus = "in-progress";
    } else if (overId === "col-completed") {
      destinationStatus = "completed";
    } else {
      // dropped over a task, check the over task's status
      const overTask = filteredTasks.find((t) => t._id === overId);
      if (overTask) {
        destinationStatus = overTask.status;
      }
    }

    if (destinationStatus !== null && destinationStatus !== isCurrentlyStatus) {
      updateTaskStatus(task, destinationStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <KanbanColumn
          id="col-pending"
          title="To Do"
          tasks={pendingTasks}
          getTaskStatus={getTaskStatus}
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
        <KanbanColumn
          id="col-in-progress"
          title="In Progress"
          tasks={inProgressTasks}
          getTaskStatus={getTaskStatus}
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
        <KanbanColumn
          id="col-completed"
          title="Completed"
          tasks={completedTasks}
          getTaskStatus={getTaskStatus}
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
      </div>
    </DndContext>
  );
}
