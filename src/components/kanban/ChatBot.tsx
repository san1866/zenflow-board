import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Task } from '@/types/kanban';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  tasks: Task[];
}

function generateResponse(input: string, tasks: Task[]): string {
  const lower = input.toLowerCase();
  const todoTasks = tasks.filter(t => t.columnId === 'todo');
  const inProgressTasks = tasks.filter(t => t.columnId === 'in-progress');
  const doneTasks = tasks.filter(t => t.columnId === 'done');
  const highPriority = tasks.filter(t => t.priority === 'high');

  if (lower.includes('how many') || lower.includes('count') || lower.includes('total')) {
    return `You have **${tasks.length}** tasks total: **${todoTasks.length}** To-do, **${inProgressTasks.length}** In Progress, **${doneTasks.length}** Done.`;
  }
  if (lower.includes('high priority') || lower.includes('urgent') || lower.includes('important')) {
    if (highPriority.length === 0) return "No high-priority tasks right now. You're on top of things! 🎉";
    return `You have **${highPriority.length}** high-priority task(s):\n${highPriority.map(t => `• ${t.title}`).join('\n')}`;
  }
  if (lower.includes('todo') || lower.includes('to do') || lower.includes('to-do')) {
    if (todoTasks.length === 0) return "Your To-do column is empty! Time to plan ahead.";
    return `**To-do tasks (${todoTasks.length}):**\n${todoTasks.map(t => `• ${t.title} (${t.priority})`).join('\n')}`;
  }
  if (lower.includes('progress') || lower.includes('working')) {
    if (inProgressTasks.length === 0) return "Nothing in progress. Ready to start something?";
    return `**In Progress (${inProgressTasks.length}):**\n${inProgressTasks.map(t => `• ${t.title} (${t.priority})`).join('\n')}`;
  }
  if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('what should')) {
    if (highPriority.length > 0) {
      const next = highPriority.find(t => t.columnId === 'todo') || highPriority[0];
      return `I'd suggest focusing on **"${next.title}"** — it's high priority${next.columnId === 'todo' ? ' and still in To-do' : ''}.`;
    }
    return "All tasks seem balanced. Pick whichever feels most impactful!";
  }
  if (lower.includes('help') || lower.includes('what can you')) {
    return "I can help with:\n• **Task overview** — ask about counts, priorities\n• **Suggestions** — what to focus on next\n• **Status** — check To-do or In Progress\n\nJust ask! 💬";
  }
  return "I'm your board assistant! Ask me about your tasks, priorities, or what to work on next. Try: *\"What's high priority?\"*";
}

export function ChatBot({ tasks }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "Hey! 👋 I'm your board assistant. Ask me about your tasks or what to focus on next." },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    const response = generateResponse(input, tasks);
    const botMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: response };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground',
          'shadow-lg glow-purple hover:scale-105 transition-transform',
          isOpen && 'hidden'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl border border-border bg-card glass shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm text-foreground">Board Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-xl px-3 py-2 text-sm whitespace-pre-line',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-secondary/60 text-foreground rounded-bl-sm'
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-border">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about your tasks..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="bg-secondary/50 border-border text-sm"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
