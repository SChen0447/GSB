import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, TaskStatus, TaskPriority } from '../types'
import dayjs from 'dayjs'

interface TaskState {
  tasks: Task[]
  theme: 'light' | 'dark'
  searchQuery: string
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void
  setTheme: (theme: 'light' | 'dark') => void
  setSearchQuery: (query: string) => void
  getFilteredTasks: () => Task[]
}

const getInitialTasks = (): Task[] => [
  {
    id: '1',
    title: '设计产品原型图',
    description: '完成首页和用户中心的原型设计，包括响应式布局和交互动效，与产品经理确认需求范围',
    priority: 'high',
    status: 'todo',
    dueDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().toISOString(),
  },
  {
    id: '2',
    title: '开发用户认证模块',
    description: '实现登录、注册和密码重置功能',
    priority: 'medium',
    status: 'inProgress',
    dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().toISOString(),
  },
  {
    id: '3',
    title: '编写项目文档',
    description: '完成技术架构说明和API接口文档编写',
    priority: 'low',
    status: 'done',
    dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    createdAt: dayjs().subtract(3, 'day').toISOString(),
  },
]

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: getInitialTasks(),
      theme: 'light',
      searchQuery: '',

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...task } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      moveTask: (taskId, newStatus, newIndex) =>
        set((state) => {
          const tasks = [...state.tasks]
          const taskIndex = tasks.findIndex((t) => t.id === taskId)
          const [movedTask] = tasks.splice(taskIndex, 1)
          movedTask.status = newStatus

          const sameStatusTasks = tasks.filter((t) => t.status === newStatus)
          const otherTasks = tasks.filter((t) => t.status !== newStatus)
          sameStatusTasks.splice(newIndex, 0, movedTask)

          return { tasks: [...otherTasks, ...sameStatusTasks] }
        }),

      setTheme: (theme) => set({ theme }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      getFilteredTasks: () => {
        const { tasks, searchQuery } = get()
        if (!searchQuery) return tasks
        return tasks.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      },
    }),
    {
      name: 'lingxi-kanban-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        theme: state.theme,
      }),
    }
  )
)
