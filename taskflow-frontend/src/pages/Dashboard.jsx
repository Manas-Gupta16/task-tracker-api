import StatCard from "../components/StatCard";
import RecentTasks from "../components/RecentTasks";
import UpcomingTasks from "../components/UpcomingTasks";
import CategoryStats from "../components/CategoryStats";

import { StatCardSkeleton } from "../components/LoadingSkeletons";
import { useGlobalTasks } from "../context/TaskContext";
import useRecentTasks from "../hooks/useRecentTasks";
import useUpcomingTasks from "../hooks/useUpcomingTasks";
import useCategoryStats from "../hooks/useCategoryStats";

function Dashboard() {
  const { tasks, stats, isLoading, isStatsLoading } = useGlobalTasks();

  const recentTasks = useRecentTasks(tasks);
  const upcomingTasks = useUpcomingTasks(tasks);
  const categoryStats = useCategoryStats(tasks);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your tasks today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {isStatsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Total Tasks" value={stats.total} />
            <StatCard title="Completed" value={stats.completed} color="text-green-600" />
            <StatCard title="Pending" value={stats.pending} color="text-red-500" />
            <StatCard title="High Priority" value={stats.highPriority} color="text-orange-500" />
            <StatCard title="Overdue" value={stats.overdue} color="text-red-600" />
          </>
        )}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <RecentTasks tasks={recentTasks} isLoading={isLoading} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <UpcomingTasks tasks={upcomingTasks} isLoading={isLoading} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <CategoryStats stats={categoryStats} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;