import { useQuery } from '@tanstack/react-query';
import { fetchAllTasks, fetchTasksForGoal } from '../api/tasksApi';

export const tasksQueryKeys = {
  all: ['tasks', 'all'] as const,
  byGoal: (goalId: string) => ['tasks', 'goal', goalId] as const,
};

export function useAllTasks() {
  return useQuery({
    queryKey: tasksQueryKeys.all,
    queryFn: fetchAllTasks,
  });
}

export function useTasksForGoal(goalId: string) {
  return useQuery({
    queryKey: tasksQueryKeys.byGoal(goalId),
    queryFn: () => fetchTasksForGoal(goalId),
    enabled: Boolean(goalId),
  });
}
