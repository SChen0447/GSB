import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, TaskStatus, COLUMNS } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isDragDisabled: boolean;
}

export function Column({ status, tasks, isDragDisabled }: ColumnProps): JSX.Element {
  const columnInfo = COLUMNS.find((col) => col.id === status);

  if (!columnInfo) {
    return <div>Invalid column</div>;
  }

  const statusColors: Record<TaskStatus, string> = {
    todo: 'bg-gray-100 dark:bg-gray-700',
    inProgress: 'bg-blue-100 dark:bg-blue-900',
    done: 'bg-green-100 dark:bg-green-900',
  };

  const headerColors: Record<TaskStatus, string> = {
    todo: 'text-gray-700 dark:text-gray-300',
    inProgress: 'text-blue-700 dark:text-blue-300',
    done: 'text-green-700 dark:text-green-300',
  };

  return (
    <div className="flex flex-col min-h-0">
      <div
        className={`
          px-4 py-3 rounded-t-lg font-semibold text-sm
          ${statusColors[status]} ${headerColors[status]}
        `}
      >
        <span>{columnInfo.title}</span>
        <span className="ml-1 text-xs opacity-70">({columnInfo.titleEn})</span>
        <span className="ml-2 text-xs opacity-70">({tasks.length})</span>
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg p-2 min-h-[200px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                暂无任务
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDragDisabled={isDragDisabled}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
