import { apiRequest } from '../../../services/apiClient';
import type { DashboardSummary } from '../types';

export function fetchDashboard(projectId?: string): Promise<DashboardSummary> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
  return apiRequest<DashboardSummary>(`/dashboard${query}`);
}
