import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '../types'
import TaskCard from './TaskCard'
import { ListTodo, Loader2, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

interface ColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isMobile: boolean
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  todo: <ListTodo size={20} />,
  inProgress: <Loader2 size={20} className="animate-spin" />,
  done: <CheckCircle2 size={20} />,
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'from-gray-400 to-gray-500',
  inProgress: 'from-blue-400 to-blue-600',
  done: 'from-green-400 to-emerald-500',
}

const Column: React.FC<ColumnProps> = ({ status, title, tasks, onEdit, onDelete, isMobile }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: isMobile,
  })

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${statusColors[status]}`}>
          <span className="text-white">{statusIcons[status]}</span>
        </div>
        <h2 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h2>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={clsx(
            'min-h-96 p-3 rounded-2xl transition-colors duration-200',
            'bg-gray-50 dark:bg-gray-800/50',
            isOver && !isMobile && 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300 dark:ring-blue-700'
          )}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                isMobile={isMobile}
              />
            ))}
          </div>
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
              <div className="w-16 h-16 mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <CheckCircle2 size={28} className="opacity-50" />
              </div>
              <p className="text-sm">暂无任务</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column
