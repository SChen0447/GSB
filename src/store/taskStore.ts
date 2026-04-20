import { create } from 'zustand';
import { format } from 'date-fns';
import {
  Task,
  TaskFormData,
  TaskStatus,
  AppState,
  TaskActions,
} from '../types';

const STORAGE_KEY = 'lingxi-kanban-data';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getInitialTasks = (): Task[] => {
  const tomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');
  const nextWeek = format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  return [
    {
      id: generateId(),
      title: '完成项目需求文档',
      description: '整理并编写项目的详细需求文档，包括功能描述和技术规格说明',
      priority: 'high',
      dueDate: tomorrow,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: '设计用户界面原型',
      description: '使用设计工具创建应用的 UI 原型图',
      priority: 'medium',
      dueDate: nextWeek,
      status: 'inProgress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: '搭建开发环境',
      description: '配置开发工具和项目基础结构',
      priority: 'low',
      dueDate: yesterday,
      status: 'done',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const saveToStorage = (state: Pick<AppState, 'tasks' | 'isDarkMode'>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tasks: state.tasks,
      isDarkMode: state.isDarkMode,
    }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (): { tasks: Task[]; isDarkMode: boolean } | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        tasks: parsed.tasks || [],
        isDarkMode: parsed.isDarkMode || false,
      };
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
};

export const useTaskStore = create<AppState & TaskActions>((set, get) => ({
  tasks: [],
  searchQuery: '',
  isDarkMode: false,
  isFormExpanded: true,
  editingTask: null,
  deletingTaskId: null,

  loadFromStorage: () => {
    const stored = loadFromStorage();
    if (stored && stored.tasks.length > 0) {
      set({
        tasks: stored.tasks,
        isDarkMode: stored.isDarkMode,
      });
      if (stored.isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    } else {
      const initialTasks = getInitialTasks();
      set({ tasks: initialTasks });
      saveToStorage({ tasks: initialTasks, isDarkMode: false });
    }
  },

  addTask: (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const newTasks = [...state.tasks, newTask];
      saveToStorage({ tasks: newTasks, isDarkMode: state.isDarkMode });
      return { tasks: newTasks };
    });
  },

  updateTask: (id: string, taskData: TaskFormData) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
          : task
      );
      saveToStorage({ tasks: newTasks, isDarkMode: state.isDarkMode });
      return { tasks: newTasks, editingTask: null };
    });
  },

  deleteTask: (id: string) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== id);
      saveToStorage({ tasks: newTasks, isDarkMode: state.isDarkMode });
      return { tasks: newTasks, deletingTaskId: null };
    });
  },

  moveTask: (id: string, newStatus: TaskStatus) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      );
      saveToStorage({ tasks: newTasks, isDarkMode: state.isDarkMode });
      return { tasks: newTasks };
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  toggleDarkMode: () => {
    set((state) => {
      const newIsDarkMode = !state.isDarkMode;
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      saveToStorage({ tasks: state.tasks, isDarkMode: newIsDarkMode });
      return { isDarkMode: newIsDarkMode };
    });
  },

  setFormExpanded: (expanded: boolean) => {
    set({ isFormExpanded: expanded });
  },

  setEditingTask: (task: Task | null) => {
    set({ editingTask: task });
  },

  setDeletingTaskId: (id: string | null) => {
    set({ deletingTaskId: id });
  },

  exportTasks: () => {
    const { tasks } = get();
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const filename = `tasks_${timestamp}.json`;
    const exportData = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
}));

export const getFilteredTasks = (tasks: Task[], searchQuery: string): Task[] => {
  if (!searchQuery.trim()) {
    return tasks;
  }
  const query = searchQuery.toLowerCase().trim();
  return tasks.filter((task) =>
    task.title.toLowerCase().includes(query)
  );
};

export const getTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter((task) => task.status === status);
};

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'inProgress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;

  return {
    total,
    todoCount,
    inProgressCount,
    doneCount,
    highPriorityCount,
  };
};
