import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/dashboardApi';

export const dashboardQueryKey = (projectId?: string) =>
  projectId ? (['dashboard', projectId] as const) : (['dashboard'] as const);

export function useDashboard(projectId?: string) {
  return useQuery({
    queryKey: dashboardQueryKey(projectId),
    queryFn: () => fetchDashboard(projectId),
  });
}
