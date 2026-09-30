import type { Goal } from '../goals/types';
import type { Task } from '../tasks/types';

export interface DashboardSummary {
  goalsCompleted: number;
  goalsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionPercent: number;
  activeGoalsCount: number;
  overdueGoals: Goal[];
  todaysGoals: Goal[];
  todaysTasks: Task[];
  tasksByStatus: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
}
