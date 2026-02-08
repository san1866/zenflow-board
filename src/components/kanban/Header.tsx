import { motion } from 'framer-motion';
import { Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/auth');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 flex items-center justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Kanban Board
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-9">
          Organize, prioritize, and track your work.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </motion.div>
  );
}
