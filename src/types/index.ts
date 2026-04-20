export type TaskStatus = 'todo' | 'inProgress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  createdAt: string
}

export interface AppState {
  tasks: Task[]
  theme: 'light' | 'dark'
  searchQuery: string
}
