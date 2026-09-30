import { apiRequest } from '../../../services/apiClient';
import type { DashboardSummary } from '../types';

export function fetchDashboard(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>('/dashboard');
}
