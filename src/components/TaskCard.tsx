import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2, Edit3, Calendar } from 'lucide-react'
import { Task, TaskPriority } from '../types'
import dayjs from 'dayjs'
import clsx from 'clsx'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isMobile: boolean
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const priorityLabels: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isMobile }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isMobile,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), 'day')

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isMobile ? listeners : {})}
      {...(!isMobile ? attributes : {})}
      className={clsx(
        'group relative p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700',
        'transition-all duration-200 cursor-grab active:cursor-grabbing',
        'hover:shadow-lg hover:-translate-y-1',
        isDragging && 'opacity-50 scale-105 shadow-2xl z-50',
        isMobile && 'cursor-default'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 dark:text-white pr-8 line-clamp-1">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task)
          }}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
        {task.description || '暂无描述'}
      </p>

      <div className="flex items-center justify-between">
        <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', priorityStyles[task.priority])}>
          {priorityLabels[task.priority]}优先级
        </span>
        <div className={clsx(
          'flex items-center text-xs gap-1',
          isOverdue ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'
        )}>
          <Calendar size={12} />
          <span>{task.dueDate}</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit(task)
        }}
        className="absolute bottom-3 right-3 p-1 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit3 size={16} />
      </button>
    </div>
  )
}

export default TaskCard
