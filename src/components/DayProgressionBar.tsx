import { DayPlan } from '@/types/certification';
import { cn } from '@/lib/utils';
import { format, parseISO, isSameDay, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DayProgressionBarProps {
  dayPlans: DayPlan[];
  maxDays?: number;
}

export const DayProgressionBar = ({ dayPlans, maxDays = 14 }: DayProgressionBarProps) => {
  const today = new Date();
  const sortedDays = [...dayPlans]
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, maxDays);

  const getDayStatus = (dayPlan: DayPlan) => {
    const dayDate = parseISO(dayPlan.date);
    const isToday = isSameDay(dayDate, today);
    const isPast = isBefore(dayDate, today);
    const isFuture = isAfter(dayDate, today);
    
    const totalTasks = dayPlan.tasks.length;
    const completedTasks = dayPlan.tasks.filter(task => task.completed).length;
    const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
    const hasProgress = completedTasks > 0;

    return {
      isToday,
      isPast,
      isFuture,
      isCompleted,
      hasProgress,
      completionRate: totalTasks > 0 ? completedTasks / totalTasks : 0
    };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Progression par jour</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted" />
        
        {/* Days */}
        <div className="flex justify-between items-start">
          {sortedDays.map((dayPlan, index) => {
            const status = getDayStatus(dayPlan);
            const dayDate = parseISO(dayPlan.date);
            
            return (
              <div key={dayPlan.date} className="flex flex-col items-center space-y-2 relative z-10">
                {/* Day circle */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300",
                    status.isCompleted && "bg-gradient-success border-success text-success-foreground shadow-button",
                    status.hasProgress && !status.isCompleted && "bg-gradient-primary border-primary text-primary-foreground",
                    !status.hasProgress && status.isPast && "bg-muted border-muted-foreground text-muted-foreground",
                    !status.hasProgress && status.isFuture && "bg-background border-border text-muted-foreground",
                    status.isToday && "ring-2 ring-primary ring-offset-2 animate-pulse-glow"
                  )}
                >
                  {format(dayDate, 'd', { locale: fr })}
                </div>
                
                {/* Progress indicator */}
                {status.hasProgress && !status.isCompleted && (
                  <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${status.completionRate * 100}%` }}
                    />
                  </div>
                )}
                
                {/* Day label */}
                <div className="text-center">
                  <div className={cn(
                    "text-xs font-medium",
                    status.isToday && "text-primary",
                    status.isCompleted && "text-success",
                    !status.isToday && !status.isCompleted && "text-muted-foreground"
                  )}>
                    {format(dayDate, 'EEE', { locale: fr })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(dayDate, 'MMM', { locale: fr })}
                  </div>
                </div>
                
                {/* Completion status */}
                {status.isCompleted && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-success" />
            <span className="text-xs text-muted-foreground">Terminé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-primary" />
            <span className="text-xs text-muted-foreground">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">À venir</span>
          </div>
        </div>
      </div>
    </div>
  );
};