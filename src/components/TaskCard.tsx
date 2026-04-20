import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isBefore, startOfDay } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Task, PRIORITY_CONFIG, AppStore } from '../types';
import { useTaskStore } from '../store/taskStore';

interface TaskCardProps {
  task: Task;
  isDragDisabled: boolean;
}

export function TaskCard({ task, isDragDisabled }: TaskCardProps): JSX.Element {
  const setEditingTask = useTaskStore((state: AppStore) => state.setEditingTask);
  const setDeletingTaskId = useTaskStore((state: AppStore) => state.setDeletingTaskId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = isBefore(startOfDay(new Date(task.dueDate)), startOfDay(new Date()));

  const handleEdit = (): void => {
    setEditingTask(task);
  };

  const handleDelete = (): void => {
    setDeletingTaskId(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm
        border border-gray-200 dark:border-gray-700
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 ease-in-out
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}
      `}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            aria-label="编辑任务"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            aria-label="删除任务"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`
            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
            ${PRIORITY_CONFIG[task.priority].colorClass}
          `}
        >
          {PRIORITY_CONFIG[task.priority].label}
        </span>
        <span
          className={`
            text-xs
            ${isOverdue && task.status !== 'done'
              ? 'text-red-500 dark:text-red-400 font-medium'
              : 'text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {task.dueDate}
        </span>
      </div>
    </div>
  );
}
