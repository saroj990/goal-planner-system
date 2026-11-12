import type { TaskPriority } from './types';

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const TASK_PRIORITY_ORDER: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function taskPriorityColors(priority: TaskPriority): { bg: string; color: string } {
  switch (priority) {
    case 'LOW':
      return { bg: '#f1f5f9', color: '#64748b' };
    case 'MEDIUM':
      return { bg: '#e0f2fe', color: '#0369a1' };
    case 'HIGH':
      return { bg: '#ffedd5', color: '#c2410c' };
    case 'URGENT':
      return { bg: '#fee2e2', color: '#b91c1c' };
    default:
      return { bg: '#f1f5f9', color: '#64748b' };
  }
}
