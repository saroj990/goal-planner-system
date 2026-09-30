import { TaskStatus } from './types';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To do',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.BLOCKED]: 'Blocked',
  [TaskStatus.DONE]: 'Done',
};

export function taskStatusColors(status: TaskStatus): { bg: string; color: string } {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return { bg: '#e0e7ff', color: '#4338ca' };
    case TaskStatus.BLOCKED:
      return { bg: '#fee2e2', color: '#b91c1c' };
    case TaskStatus.DONE:
      return { bg: '#d1fae5', color: '#047857' };
    default:
      return { bg: '#f1f5f9', color: '#475569' };
  }
}
