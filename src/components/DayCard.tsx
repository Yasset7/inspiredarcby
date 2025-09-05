import { DayPlan } from "@/types/certification";
import { TaskItem } from "./TaskItem";
import { ProgressBar } from "./ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Trophy } from "lucide-react";

interface DayCardProps {
  dayPlan: DayPlan;
  onToggleTask: (taskId: string) => void;
}

export const DayCard = ({ dayPlan, onToggleTask }: DayCardProps) => {
  const totalHours = dayPlan.tasks.reduce((sum, task) => sum + task.hours, 0);
  const completedHours = dayPlan.tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.hours, 0);
  
  const isCompleted = dayPlan.tasks.every(task => task.completed);
  const isToday = dayPlan.date === new Date().toISOString().split('T')[0];
  const isPast = dayPlan.date < new Date().toISOString().split('T')[0];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return "Aujourd'hui";
    if (dateStr === tomorrow.toISOString().split('T')[0]) return "Demain";
    if (dateStr === yesterday.toISOString().split('T')[0]) return "Hier";
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };
  
  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1: return 'ml-cert';
      case 2: return 'aws-cert';
      case 3: return 'terraform-cert';
      default: return 'primary';
    }
  };
  
  return (
    <Card className={cn(
      "transition-all duration-300 animate-slide-up",
      isCompleted && "ring-2 ring-success",
      isToday && "ring-2 ring-primary animate-pulse-glow",
      isPast && !isCompleted && "opacity-90"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className={cn(
              "w-5 h-5",
              isToday ? "text-primary" : "text-muted-foreground"
            )} />
            <div>
              <h3 className={cn(
                "font-bold text-lg",
                isToday ? "text-primary" : "text-foreground"
              )}>
                {formatDate(dayPlan.date)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Phase {dayPlan.phase} • {totalHours}h de travail
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary"
              className={`bg-${getPhaseColor(dayPlan.phase)}/10 text-${getPhaseColor(dayPlan.phase)} border-${getPhaseColor(dayPlan.phase)}/20`}
            >
              Phase {dayPlan.phase}
            </Badge>
            {isCompleted && (
              <Badge variant="default" className="bg-gradient-success animate-bounce-in">
                <Trophy className="w-3 h-3 mr-1" />
                Terminé !
              </Badge>
            )}
          </div>
        </div>
        
        <ProgressBar 
          value={completedHours} 
          max={totalHours}
          label="Progression du jour"
          variant={isCompleted ? 'success' : 'default'}
        />
      </CardHeader>
      
      <CardContent className="space-y-3">
        {dayPlan.tasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            onToggleComplete={onToggleTask}
          />
        ))}
      </CardContent>
    </Card>
  );
};