import { useState, useEffect, useMemo } from 'react';
import { DayPlan, Task } from '@/types/certification';
import { phases } from '@/lib/certification-data';
import { saveProgress, loadProgress, calculateStats } from '@/lib/localStorage';
import { DayCard } from './DayCard';
import { StatsPanel } from './StatsPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Award, Target } from 'lucide-react';

export const CertificationDashboard = () => {
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const { toast } = useToast();
  
  // Generate day plans from phases
  useEffect(() => {
    const generateDayPlans = (): DayPlan[] => {
      const plans: DayPlan[] = [];
      
      phases.forEach(phase => {
        const startDate = new Date(phase.startDate);
        const endDate = new Date(phase.endDate);
        
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          const dateString = date.toISOString().split('T')[0];
          
          const dayTasks: Task[] = phase.tasks.map((task, index) => ({
            id: `${dateString}-${phase.id}-${index}`,
            name: task.name,
            hours: task.hours,
            type: task.type,
            completed: false
          }));
          
          plans.push({
            date: dateString,
            tasks: dayTasks,
            phase: phase.id
          });
        }
      });
      
      return plans.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };
    
    const plans = generateDayPlans();
    
    // Load saved progress
    const savedProgress = loadProgress();
    plans.forEach(day => {
      if (savedProgress[day.date]) {
        day.tasks.forEach(task => {
          const savedTask = savedProgress[day.date].find(saved => saved.id === task.id);
          if (savedTask) {
            task.completed = savedTask.completed;
          }
        });
      }
    });
    
    setDayPlans(plans);
  }, []);
  
  const stats = useMemo(() => calculateStats(dayPlans), [dayPlans]);
  
  const handleToggleTask = (taskId: string) => {
    setDayPlans(prevPlans => {
      const newPlans = prevPlans.map(day => ({
        ...day,
        tasks: day.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }));
      
      // Save progress
      saveProgress(newPlans);
      
      // Show toast for task completion
      const task = newPlans.flatMap(day => day.tasks).find(t => t.id === taskId);
      if (task?.completed) {
        toast({
          title: "Tâche terminée ! 🎉",
          description: `${task.name} (${task.hours}h) validée avec succès.`,
        });
      }
      
      return newPlans;
    });
  };
  
  const resetProgress = () => {
    setDayPlans(prev => prev.map(day => ({
      ...day,
      tasks: day.tasks.map(task => ({ ...task, completed: false }))
    })));
    localStorage.removeItem('certification-progress');
    toast({
      title: "Progression réinitialisée",
      description: "Toutes les tâches ont été marquées comme non complétées.",
    });
  };
  
  // Filter and sort days for display
  const today = new Date().toISOString().split('T')[0];
  const upcomingDays = dayPlans.filter(day => day.date >= today).slice(0, 7);
  const recentDays = dayPlans
    .filter(day => day.date < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary-foreground/20 p-3 rounded-full">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Tableau de Progression des Certifications
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Suivez votre parcours de formation inspiré de Duolingo
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            {phases.map(phase => (
              <Badge key={phase.id} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                <BookOpen className="w-3 h-3 mr-1" />
                {phase.name}
              </Badge>
            ))}
            
            <Button 
              variant="secondary" 
              onClick={resetProgress}
              size="sm"
              className="ml-auto bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
            >
              <Target className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <StatsPanel stats={stats} />
        
        {/* Upcoming Days */}
        {upcomingDays.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Prochains Jours
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingDays.map(day => (
                <DayCard 
                  key={day.date}
                  dayPlan={day}
                  onToggleTask={handleToggleTask}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Recent Days */}
        {recentDays.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
              Jours Précédents
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentDays.map(day => (
                <DayCard 
                  key={day.date}
                  dayPlan={day}
                  onToggleTask={handleToggleTask}
                />
              ))}
            </div>
          </section>
        )}
        
        {dayPlans.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Chargement du planning...
            </h3>
            <p className="text-muted-foreground">
              Génération de votre parcours de certification personnalisé.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};