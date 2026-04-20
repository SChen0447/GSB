import React, { useMemo } from 'react'
import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '../types'
import { useTaskStore } from '../store/useTaskStore'
import Column from './Column'
import TaskCard from './TaskCard'

interface BoardProps {
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isMobile: boolean
}

const columns: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: '待处理' },
  { status: 'inProgress', title: '进行中' },
  { status: 'done', title: '已完成' },
]

const Board: React.FC<BoardProps> = ({ onEdit, onDelete, isMobile }) => {
  const { tasks, moveTask, getFilteredTasks } = useTaskStore()
  const filteredTasks = getFilteredTasks()
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getTaskPos = (id: string) => tasks.findIndex((task) => task.id === id)

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || isMobile) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (!activeTask) return

    if (!overTask) {
      if (columns.some((c) => c.status === overId)) {
        const overColumnTasks = filteredTasks.filter(
          (t) => t.status === overId && t.id !== activeId
        )
        const newIndex = overColumnTasks.length
        moveTask(activeId, overId as TaskStatus, newIndex)
      }
      return
    }

    if (activeTask.status !== overTask.status) {
      const overColumnTasks = filteredTasks.filter(
        (t) => t.status === overTask.status && t.id !== activeId
      )
      const overPos = overColumnTasks.findIndex((t) => t.id === overId)
      const newIndex = Math.max(0, overPos)
      moveTask(activeId, overTask.status, newIndex)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || isMobile) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (!activeTask || !overTask) return

    if (activeTask.status === overTask.status) {
      const sameStatusTasks = filteredTasks.filter((t) => t.status === activeTask.status)
      const oldIndex = sameStatusTasks.findIndex((t) => t.id === activeId)
      const newIndex = sameStatusTasks.findIndex((t) => t.id === overId)
      const newTasks = arrayMove(sameStatusTasks, oldIndex, newIndex)
      newTasks.forEach((task, index) => {
        moveTask(task.id, task.status, index)
      })
    }
  }

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeId),
    [activeId, tasks]
  )

  const getTasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((task) => task.status === status)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Column
            key={column.status}
            status={column.status}
            title={column.title}
            tasks={getTasksByStatus(column.status)}
            onEdit={onEdit}
            onDelete={onDelete}
            isMobile={isMobile}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 rotate-2 scale-105">
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              isMobile={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
