import { TaskPriority } from './types';

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.URGENT]: 'Urgent',
};

export const TASK_PRIORITY_ORDER: TaskPriority[] = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.URGENT,
];

export function taskPriorityColors(priority: TaskPriority): { bg: string; color: string } {
  switch (priority) {
    case TaskPriority.LOW:
      return { bg: '#f1f5f9', color: '#64748b' };
    case TaskPriority.MEDIUM:
      return { bg: '#e0f2fe', color: '#0369a1' };
    case TaskPriority.HIGH:
      return { bg: '#ffedd5', color: '#c2410c' };
    case TaskPriority.URGENT:
      return { bg: '#fee2e2', color: '#b91c1c' };
    default:
      return { bg: '#f1f5f9', color: '#64748b' };
  }
}
