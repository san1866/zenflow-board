import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { Task, ColumnId } from '@/types/kanban';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  accentClass: string;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export function KanbanColumn({ id, title, tasks, accentClass, onDelete, onAddClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-border bg-card/40 glass min-h-[500px] w-full',
        'transition-all duration-300',
        isOver && 'border-primary/50 glow-purple'
      )}
    >
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className={cn('w-2.5 h-2.5 rounded-full', accentClass)} />
          <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">{title}</h3>
          <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full mono">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 pt-0 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-xs border border-dashed border-border rounded-xl">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
