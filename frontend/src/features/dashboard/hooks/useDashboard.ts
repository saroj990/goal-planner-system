import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/dashboardApi';

export const dashboardQueryKey = ['dashboard'] as const;

export function useDashboard() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboard,
  });
}
