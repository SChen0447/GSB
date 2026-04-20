import React from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const StatsPanel: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks)

  const total = tasks.length
  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'inProgress').length
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length

  const stats = [
    {
      label: '总任务',
      value: total,
      icon: ClipboardList,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: '待处理',
      value: todoCount,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: '进行中',
      value: inProgressCount,
      icon: AlertTriangle,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: '已完成',
      value: doneCount,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
              <stat.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 col-span-2 md:col-span-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{highPriorityCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">高优先级任务</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
