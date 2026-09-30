import { useQuery } from '@tanstack/react-query';
import { fetchTasksForGoal } from '../api/tasksApi';

export const tasksQueryKeys = {
  byGoal: (goalId: string) => ['tasks', 'goal', goalId] as const,
};

export function useTasksForGoal(goalId: string) {
  return useQuery({
    queryKey: tasksQueryKeys.byGoal(goalId),
    queryFn: () => fetchTasksForGoal(goalId),
    enabled: Boolean(goalId),
  });
}
