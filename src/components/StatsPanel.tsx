import { useTaskStore, getTaskStats } from '../store/taskStore';
import { COLUMNS, AppStore } from '../types';

export function StatsPanel(): JSX.Element {
  const tasks = useTaskStore((state: AppStore) => state.tasks);
  const stats = getTaskStats(tasks);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        任务统计
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">总任务数</div>
        </div>
        {COLUMNS.map((col) => {
          const count = col.id === 'todo'
            ? stats.todoCount
            : col.id === 'inProgress'
            ? stats.inProgressCount
            : stats.doneCount;
          return (
            <div key={col.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {count}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{col.title}</div>
            </div>
          );
        })}
        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.highPriorityCount}
          </div>
          <div className="text-xs text-red-500 dark:text-red-400">高优先级</div>
        </div>
      </div>
    </div>
  );
}
