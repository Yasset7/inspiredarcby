export interface Task {
  id: string;
  name: string;
  hours: number;
  type: 'ml' | 'aws' | 'terraform' | 'revision' | 'lab';
  completed: boolean;
}

export interface DayPlan {
  date: string;
  tasks: Task[];
  phase: number;
}

export interface Phase {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  color: 'gradient-ml' | 'gradient-aws' | 'gradient-terraform' | 'gradient-primary';
  tasks: Array<{
    name: string;
    hours: number;
    type: 'ml' | 'aws' | 'terraform' | 'revision' | 'lab';
  }>;
}

export interface ProgressStats {
  totalHours: number;
  completedHours: number;
  totalDays: number;
  completedDays: number;
  streak: number;
  phase1Progress: number;
  phase2Progress: number;
  phase3Progress: number;
}