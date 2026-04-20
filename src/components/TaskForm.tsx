import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Task, TaskPriority, TaskStatus } from '../types'
import dayjs from 'dayjs'
import clsx from 'clsx'

interface TaskFormProps {
  task?: Task | null
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel?: () => void
}

interface FormErrors {
  title?: string
  priority?: string
  dueDate?: string
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const isEditing = !!task
  const today = dayjs().format('YYYY-MM-DD')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(task.dueDate)
    }
  }, [task])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setStatus('todo')
    setDueDate('')
    setErrors({})
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = '标题不能为空'
    }

    if (!priority) {
      newErrors.priority = '请选择优先级'
    }

    if (!dueDate) {
      newErrors.dueDate = '请选择截止日期'
    } else if (dayjs(dueDate).isBefore(dayjs(), 'day')) {
      newErrors.dueDate = '截止日期不能早于当天'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
    })

    if (!isEditing) {
      resetForm()
    }
  }

  const handleCancel = () => {
    resetForm()
    onCancel?.()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Plus size={20} className={clsx('transition-transform', isExpanded && 'rotate-45')} />
          {isEditing ? '编辑任务' : '添加新任务'}
        </span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务标题..."
              className={clsx(
                'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
                errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="输入任务描述（最多200字符）..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
              {description.length}/200
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                优先级 <span className="text-red-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={clsx(
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                  'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
                  errors.priority ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                )}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="todo">待处理</option>
                  <option value="inProgress">进行中</option>
                  <option value="done">已完成</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                截止日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                min={today}
                onChange={(e) => setDueDate(e.target.value)}
                className={clsx(
                  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
                  'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
                  errors.dueDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                )}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {isEditing ? '保存修改' : '添加任务'}
            </button>
            {isEditing && onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                取消
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default TaskForm
