import { useEffect } from 'react';
import { Sun, Moon, Search, Download } from 'lucide-react';
import { useTaskStore } from './store/taskStore';
import { TaskForm } from './components/TaskForm';
import { StatsPanel } from './components/StatsPanel';
import { Board } from './components/Board';
import { ConfirmModal } from './components/ConfirmModal';

function App(): JSX.Element {
  const {
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    editingTask,
    deletingTaskId,
    deleteTask,
    setDeletingTaskId,
    exportTasks,
    loadFromStorage,
  } = useTaskStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleDeleteConfirm = (): void => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                灵犀看板
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                智能任务拖拽工作台
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="按标题搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    pl-10 pr-4 py-2 w-48 sm:w-64
                    border border-gray-300 dark:border-gray-600
                    rounded-lg bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-colors
                  "
                />
              </div>
              <button
                type="button"
                onClick={exportTasks}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-green-600 hover:bg-green-700
                  text-white rounded-lg transition-colors
                  text-sm font-medium
                "
              >
                <Download size={18} />
                <span className="hidden sm:inline">导出 JSON</span>
              </button>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="
                  p-2 rounded-lg
                  bg-gray-200 dark:bg-gray-700
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-300 dark:hover:bg-gray-600
                  transition-colors
                "
                aria-label={isDarkMode ? '切换到亮色主题' : '切换到暗色主题'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        <main>
          <TaskForm editingTask={editingTask} />
          <StatsPanel />
          <Board />
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>数据自动保存到本地存储</p>
        </footer>
      </div>

      <ConfirmModal
        isOpen={deletingTaskId !== null}
        title="删除任务"
        message="确定要删除这个任务吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTaskId(null)}
      />
    </div>
  );
}

export default App;
