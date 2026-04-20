import React from 'react'
import { Sun, Moon, Download, Search, Info } from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'
import dayjs from 'dayjs'

interface HeaderProps {
  isMobile: boolean
}

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { theme, setTheme, setSearchQuery, searchQuery, tasks } = useTaskStore()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleExport = () => {
    const data = JSON.stringify(tasks, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tasks_${dayjs().format('YYYYMMDD_HHmmss')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleMobileDrag = () => {
    if (isMobile) {
      alert('移动端暂不支持拖拽功能，请使用桌面端体验完整功能')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
              <Download size={24} className="text-white rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                灵犀看板
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                智能任务拖拽工作台
              </p>
            </div>
            {isMobile && (
              <button
                onClick={handleMobileDrag}
                className="ml-2 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center gap-1 group"
                title="移动端拖拽功能提示"
              >
                <Info size={14} className="text-amber-600 dark:text-amber-400" />
                <span className="text-xs text-amber-700 dark:text-amber-400 hidden sm:inline">
                  拖拽仅桌面端可用
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="按标题搜索..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              onClick={handleExport}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="导出 JSON"
            >
              <Download size={18} className="text-gray-600 dark:text-gray-300" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="切换主题"
            >
              {theme === 'light' ? (
                <Moon size={18} className="text-gray-600" />
              ) : (
                <Sun size={18} className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
