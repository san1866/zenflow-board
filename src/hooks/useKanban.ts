import { useState, useCallback } from 'react';
import { Task, ColumnId, Priority } from '@/types/kanban';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design system tokens',
    description: 'Define color palette and typography scale',
    priority: 'high',
    columnId: 'todo',
    createdAt: new Date().toISOString(),
    tags: ['design'],
  },
  {
    id: '2',
    title: 'API integration',
    description: 'Connect frontend to backend endpoints',
    priority: 'medium',
    columnId: 'todo',
    createdAt: new Date().toISOString(),
    tags: ['backend'],
  },
  {
    id: '3',
    title: 'User authentication',
    description: 'Implement login and signup flow',
    priority: 'high',
    columnId: 'in-progress',
    createdAt: new Date().toISOString(),
    tags: ['auth'],
  },
  {
    id: '4',
    title: 'Dashboard layout',
    description: 'Build responsive dashboard grid',
    priority: 'low',
    columnId: 'in-progress',
    createdAt: new Date().toISOString(),
    tags: ['frontend'],
  },
];

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback((title: string, description: string, priority: Priority, columnId: ColumnId, tags?: string[]) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      columnId,
      createdAt: new Date().toISOString(),
      tags,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const moveTask = useCallback((taskId: string, newColumnId: ColumnId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, columnId: newColumnId } : t))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    );
  }, []);

  const getColumnTasks = useCallback(
    (columnId: ColumnId) => tasks.filter(t => t.columnId === columnId),
    [tasks]
  );

  return { tasks, addTask, moveTask, deleteTask, updateTask, getColumnTasks };
}
