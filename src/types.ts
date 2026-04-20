export type TaskStatus = 'todo' | 'inProgress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
}

export interface ColumnInfo {
  id: TaskStatus;
  title: string;
  titleEn: string;
}

export const COLUMNS: ColumnInfo[] = [
  { id: 'todo', title: '待处理', titleEn: 'Todo' },
  { id: 'inProgress', title: '进行中', titleEn: 'In Progress' },
  { id: 'done', title: '已完成', titleEn: 'Done' },
];

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; colorClass: string }> = {
  low: { label: '低', colorClass: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  medium: { label: '中', colorClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  high: { label: '高', colorClass: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
};

export interface AppState {
  tasks: Task[];
  searchQuery: string;
  isDarkMode: boolean;
  isFormExpanded: boolean;
  editingTask: Task | null;
  deletingTaskId: string | null;
}

export interface TaskActions {
  addTask: (taskData: TaskFormData) => void;
  updateTask: (id: string, taskData: TaskFormData) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  setFormExpanded: (expanded: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  setDeletingTaskId: (id: string | null) => void;
  loadFromStorage: () => void;
  exportTasks: () => void;
}

export type AppStore = AppState & TaskActions;
