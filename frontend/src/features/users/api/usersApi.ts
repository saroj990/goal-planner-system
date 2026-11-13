import { apiRequest } from '../../../services/apiClient';
import type { TaskAssigneeSummary } from '../../tasks/types';
import type { UserRole } from '../../auth/types';

export interface AssignableUser extends TaskAssigneeSummary {
  role?: UserRole;
}

export function fetchAssignableUsers(): Promise<AssignableUser[]> {
  return apiRequest<AssignableUser[]>('/users/assignable');
}
