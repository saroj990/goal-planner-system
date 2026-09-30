import { useQuery } from '@tanstack/react-query';
import { fetchProgress } from '../api/progressApi';

export const progressQueryKey = (days: number) => ['progress', days] as const;

export function useProgress(days = 30) {
  return useQuery({
    queryKey: progressQueryKey(days),
    queryFn: () => fetchProgress(days),
  });
}
