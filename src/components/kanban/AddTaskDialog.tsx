import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Priority, ColumnId } from '@/types/kanban';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumn: ColumnId;
  onAdd: (title: string, description: string, priority: Priority, columnId: ColumnId, tags?: string[]) => void;
}

export function AddTaskDialog({ open, onOpenChange, defaultColumn, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : undefined;
    onAdd(title, description, priority, defaultColumn, tags);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTagsInput('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-secondary/50 border-border"
            autoFocus
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-secondary/50 border-border resize-none"
            rows={3}
          />
          <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">🔴 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Tags (comma separated)"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            className="bg-secondary/50 border-border"
          />
          <Button type="submit" className="w-full">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
