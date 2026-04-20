import { useEffect, useState } from 'react'
import { useTaskStore } from './store/useTaskStore'
import { Task } from './types'
import Header from './components/Header'
import StatsPanel from './components/StatsPanel'
import TaskForm from './components/TaskForm'
import Board from './components/Board'
import Modal, { ConfirmModal } from './components/Modal'

function App() {
  const { theme, addTask, updateTask, deleteTask } = useTaskStore()
  const [isMobile, setIsMobile] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const handleAddTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(data)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowEditModal(true)
  }

  const handleUpdateTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
      setEditingTask(null)
      setShowEditModal(false)
    }
  }

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task)
  }

  const confirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id)
      setDeletingTask(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header isMobile={isMobile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <StatsPanel />
        </div>

        <div className="mb-8">
          <TaskForm onSubmit={handleAddTask} />
        </div>

        <Board
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          isMobile={isMobile}
        />
      </main>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingTask(null)
        }}
        title="编辑任务"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setShowEditModal(false)
            setEditingTask(null)
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDelete}
        title="确认删除"
        message={`确定要删除任务"${deletingTask?.title}"吗？此操作不可撤销。`}
        confirmText="删除"
        variant="danger"
      />

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>灵犀看板 · 智能任务拖拽工作台 © 2025</p>
      </footer>
    </div>
  )
}

export default App
