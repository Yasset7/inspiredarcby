import { Task } from "@/types/certification";
import { Button } from "@/components/ui/button";
import { getTypeIcon, getTypeColor } from "@/lib/certification-data";
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
}

export const TaskItem = ({ task, onToggleComplete }: TaskItemProps) => {
  const typeColor = getTypeColor(task.type);
  const typeIcon = getTypeIcon(task.type);
  
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300",
      task.completed 
        ? "bg-muted/50 border-muted-foreground/20 opacity-75" 
        : "bg-card border-border shadow-card hover:shadow-hover"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold",
          task.completed ? "bg-success text-success-foreground" : `bg-${typeColor}/10 text-${typeColor}`
        )}>
          {task.completed ? <Check className="w-5 h-5" /> : typeIcon}
        </div>
        
        <div className="flex flex-col">
          <h4 className={cn(
            "font-semibold transition-colors",
            task.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {task.name}
          </h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{task.hours}h</span>
          </div>
        </div>
      </div>
      
      <Button
        onClick={() => onToggleComplete(task.id)}
        variant={task.completed ? "secondary" : "default"}
        size="sm"
        className={cn(
          "transition-all duration-300",
          task.completed 
            ? "opacity-50 cursor-default" 
            : "hover:scale-105 animate-pulse-glow"
        )}
        disabled={task.completed}
      >
        {task.completed ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Terminé
          </>
        ) : (
          "Valider"
        )}
      </Button>
    </div>
  );
};