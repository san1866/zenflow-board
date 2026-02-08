import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useKanban } from '@/hooks/useKanban';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskDialog } from './AddTaskDialog';
import { ChatBot } from './ChatBot';
import { ColumnId } from '@/types/kanban';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function KanbanBoard() {
  const { tasks, addTask, moveTask, deleteTask, getColumnTasks } = useKanban();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogColumn, setDialogColumn] = useState<ColumnId>('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Dropped on a column
    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      moveTask(taskId, overId as ColumnId);
      return;
    }

    // Dropped on another task — move to that task's column
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      moveTask(taskId, overTask.columnId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.columnId !== overId) {
        moveTask(taskId, overId as ColumnId);
      }
    }
  };

  const openDialog = (col: ColumnId) => {
    setDialogColumn(col);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[hsl(199_89%_48%/0.05)] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Kanban Board
            </h1>
          </div>
          <p className="text-muted-foreground text-sm ml-9">
            Organize, prioritize, and track your work.
          </p>
        </motion.div>

        {/* Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <KanbanColumn
                id="todo"
                title="To Do"
                tasks={getColumnTasks('todo')}
                accentClass="bg-primary"
                onDelete={deleteTask}
                onAddClick={() => openDialog('todo')}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <KanbanColumn
                id="in-progress"
                title="In Progress"
                tasks={getColumnTasks('in-progress')}
                accentClass="bg-[hsl(199_89%_48%)]"
                onDelete={deleteTask}
                onAddClick={() => openDialog('in-progress')}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <KanbanColumn
                id="done"
                title="Done"
                tasks={getColumnTasks('done')}
                accentClass="bg-emerald-500"
                onDelete={deleteTask}
                onAddClick={() => openDialog('done')}
              />
            </motion.div>
          </div>
        </DndContext>
      </div>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultColumn={dialogColumn}
        onAdd={addTask}
      />

      <ChatBot tasks={tasks} />
    </div>
  );
}
