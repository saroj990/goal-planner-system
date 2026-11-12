import type { Project } from '../projects/types';
import type { Task } from '../tasks/types';

export interface DashboardSummary {
  filterProjectId: string | null;
  projectsCompleted: number;
  projectsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionPercent: number;
  activeProjectsCount: number;
  overdueProjects: Project[];
  activeProjects: Project[];
  tasks: Task[];
  tasksByStatus: {
    todo: Task[];
    inProgress: Task[];
    blocked: Task[];
    done: Task[];
  };
}
