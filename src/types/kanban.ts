export type Priority = 'high' | 'medium' | 'low';
export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  columnId: ColumnId;
  createdAt: string;
  tags?: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}
