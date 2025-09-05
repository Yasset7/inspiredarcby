import { DayPlan } from '@/types/certification';

const STORAGE_KEY = 'certification-progress';

export const saveProgress = (dayPlans: DayPlan[]): void => {
  try {
    const progressData = dayPlans.reduce((acc, day) => {
      acc[day.date] = day.tasks.map(task => ({
        id: task.id,
        completed: task.completed
      }));
      return acc;
    }, {} as Record<string, Array<{ id: string; completed: boolean }>>);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const loadProgress = (): Record<string, Array<{ id: string; completed: boolean }>> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading progress:', error);
    return {};
  }
};

export const calculateStats = (dayPlans: DayPlan[]) => {
  const totalHours = dayPlans.reduce((sum, day) => 
    sum + day.tasks.reduce((daySum, task) => daySum + task.hours, 0), 0
  );
  
  const completedHours = dayPlans.reduce((sum, day) => 
    sum + day.tasks.filter(task => task.completed).reduce((daySum, task) => daySum + task.hours, 0), 0
  );
  
  const totalDays = dayPlans.length;
  const completedDays = dayPlans.filter(day => 
    day.tasks.every(task => task.completed)
  ).length;
  
  // Calculate streak (consecutive completed days from today backwards)
  const today = new Date().toISOString().split('T')[0];
  const sortedDays = dayPlans
    .filter(day => day.date <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  for (const day of sortedDays) {
    if (day.tasks.every(task => task.completed)) {
      streak++;
    } else {
      break;
    }
  }
  
  // Phase progress
  const phase1Days = dayPlans.filter(day => day.phase === 1);
  const phase2Days = dayPlans.filter(day => day.phase === 2);
  const phase3Days = dayPlans.filter(day => day.phase === 3);
  
  const phase1Progress = phase1Days.length > 0 
    ? (phase1Days.filter(day => day.tasks.every(task => task.completed)).length / phase1Days.length) * 100 
    : 0;
  
  const phase2Progress = phase2Days.length > 0 
    ? (phase2Days.filter(day => day.tasks.every(task => task.completed)).length / phase2Days.length) * 100 
    : 0;
    
  const phase3Progress = phase3Days.length > 0 
    ? (phase3Days.filter(day => day.tasks.every(task => task.completed)).length / phase3Days.length) * 100 
    : 0;
  
  return {
    totalHours,
    completedHours,
    totalDays,
    completedDays,
    streak,
    phase1Progress,
    phase2Progress,
    phase3Progress
  };
};