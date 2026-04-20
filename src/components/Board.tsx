import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTaskStore, getFilteredTasks, getTasksByStatus } from '../store/taskStore';
import { Column } from './Column';
import { Task, TaskStatus, COLUMNS, AppStore } from '../types';
import { TaskCard } from './TaskCard';

export function Board(): JSX.Element {
  const { tasks, searchQuery, moveTask } = useTaskStore((state: AppStore) => ({
    tasks: state.tasks,
    searchQuery: state.searchQuery,
    moveTask: state.moveTask,
  }));
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = useMemo(
    () => getFilteredTasks(tasks, searchQuery),
    [tasks, searchQuery]
  );

  const tasksByStatus = useMemo(
    () => ({
      todo: getTasksByStatus(filteredTasks, 'todo' as TaskStatus),
      inProgress: getTasksByStatus(filteredTasks, 'inProgress' as TaskStatus),
      done: getTasksByStatus(filteredTasks, 'done' as TaskStatus),
    }),
    [filteredTasks]
  );

  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeTaskItem = tasks.find((t) => t.id === activeId);
      const overTask = tasks.find((t) => t.id === overId);

      if (activeTaskItem) {
        if (overTask) {
          moveTask(activeId, overTask.status);
        } else {
          const overColumn = COLUMNS.find((col) => col.id === overId);
          if (overColumn) {
            moveTask(activeId, overColumn.id);
          }
        }
      }
    }

    setActiveTask(null);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {COLUMNS.map((column) => (
          <div key={column.id}>
            <Column
              status={column.id}
              tasks={tasksByStatus[column.id]}
              isDragDisabled={true}
            />
          </div>
        ))}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center text-sm text-yellow-700 dark:text-yellow-300">
          移动端视图下拖拽功能已禁用
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            status={column.id}
            tasks={tasksByStatus[column.id]}
            isDragDisabled={false}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskCard task={activeTask} isDragDisabled={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
