import { useState, useEffect, useCallback } from 'react';
import { format, startOfDay } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Task, TaskFormData, COLUMNS } from '../types';
import { useTaskStore } from '../store/taskStore';

interface FormErrors {
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}

interface TaskFormProps {
  editingTask: Task | null;
}

export function TaskForm({ editingTask }: TaskFormProps): JSX.Element {
  const { addTask, updateTask, isFormExpanded, setFormExpanded, setEditingTask } = useTaskStore();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'todo',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        status: editingTask.status,
      });
      setFormExpanded(true);
    }
  }, [editingTask, setFormExpanded]);

  const resetForm = useCallback((): void => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'todo',
    });
    setErrors({});
    setEditingTask(null);
  }, [setEditingTask]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    } else if (formData.title.trim().length < 1) {
      newErrors.title = '标题至少需要1个字符';
    }

    if (formData.description.length > 200) {
      newErrors.description = '描述最多200个字符';
    }

    if (!formData.priority) {
      newErrors.priority = '请选择优先级';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = '请选择截止日期';
    } else {
      const selectedDate = startOfDay(new Date(formData.dueDate));
      const today = startOfDay(new Date());
      if (isBefore(selectedDate, today)) {
        newErrors.dueDate = '截止日期不能早于今天';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData: TaskFormData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate,
      status: formData.status,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    resetForm();
  };

  const handleCancel = (): void => {
    resetForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isBefore = (date1: Date, date2: Date): boolean => {
    return date1.getTime() < date2.getTime();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <button
        type="button"
        onClick={() => setFormExpanded(!isFormExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
      >
        <span>{editingTask ? '编辑任务' : '添加新任务'}</span>
        {isFormExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isFormExpanded && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`
                w-full px-3 py-2 border rounded-lg
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              `}
              placeholder="输入任务标题"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              maxLength={200}
              className={`
                w-full px-3 py-2 border rounded-lg resize-none
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              `}
              placeholder="输入任务描述（可选，最多200字符）"
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {formData.description.length}/200
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                优先级 <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className={`
                  w-full px-3 py-2 border rounded-lg
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.priority ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                `}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-500">{errors.priority}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                截止日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                className={`
                  w-full px-3 py-2 border rounded-lg
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                `}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                状态
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="
                  w-full px-3 py-2 border rounded-lg
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  border-gray-300 dark:border-gray-600
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                "
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {editingTask && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingTask ? '保存修改' : '添加任务'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
