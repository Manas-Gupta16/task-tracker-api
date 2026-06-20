import React from "react";

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
    </div>
  );
}

export function TaskItemSkeleton() {
  return (
    <div className="border-b border-gray-300 dark:border-gray-700 pb-3 mb-3 last:border-none last:mb-0 last:pb-0 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="border p-4 mb-3 rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
      
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function CategoryStatSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        </div>
      ))}
    </div>
  );
}

export function KanbanColumnSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl min-w-[300px] w-full max-w-[350px] animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
      </div>
      <div className="space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
}
