import { apiRequest } from '../../../services/apiClient';
import type { TaskAssigneeSummary } from '../../tasks/types';

export function fetchAssignableUsers(): Promise<TaskAssigneeSummary[]> {
  return apiRequest<TaskAssigneeSummary[]>('/users/assignable');
}
