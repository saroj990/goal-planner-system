import { useQuery } from '@tanstack/react-query';
import { fetchGoal, fetchGoals } from '../api/goalsApi';
import type { GoalType } from '../types';

export const goalsQueryKeys = {
  all: ['goals'] as const,
  list: (type?: GoalType) => [...goalsQueryKeys.all, 'list', type ?? 'ALL'] as const,
  detail: (id: string) => [...goalsQueryKeys.all, 'detail', id] as const,
};

export function useGoalsList(type?: GoalType) {
  return useQuery({
    queryKey: goalsQueryKeys.list(type),
    queryFn: () => fetchGoals(type),
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: goalsQueryKeys.detail(id),
    queryFn: () => fetchGoal(id),
    enabled: Boolean(id),
  });
}
