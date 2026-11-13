import { ProjectStatus } from './types';

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: 'Active',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.ARCHIVED]: 'Archived',
};

export function projectStatusColors(status: ProjectStatus): { bg: string; color: string } {
  switch (status) {
    case ProjectStatus.COMPLETED:
      return { bg: '#d1fae5', color: '#047857' };
    case ProjectStatus.ARCHIVED:
      return { bg: '#f1f5f9', color: '#64748b' };
    default:
      return { bg: '#e0e7ff', color: '#4338ca' };
  }
}
