import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Task } from '@/types/kanban';
import { Badge } from '@/components/ui/badge';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const priorityConfig = {
  high: { label: 'High', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medium: { label: 'Med', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  low: { label: 'Low', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'group relative rounded-xl border border-border bg-card p-4 cursor-grab active:cursor-grabbing',
        'hover:border-primary/40 transition-all duration-200',
        'hover:shadow-[0_0_20px_hsl(262_83%_58%/0.1)]',
        isDragging && 'z-50 shadow-2xl'
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', priority.class)}>
              {priority.label}
            </span>
          </div>
          <h4 className="font-semibold text-sm text-foreground leading-tight mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {task.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 bg-secondary/60 text-muted-foreground border-none">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}
