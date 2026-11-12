import { useQuery } from '@tanstack/react-query';
import { fetchAllTasks, fetchTasksForProject } from '../api/tasksApi';

export const tasksQueryKeys = {
  all: (projectId?: string) => (projectId ? ['tasks', 'all', projectId] as const : ['tasks', 'all'] as const),
  byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
};

export function useAllTasks(projectId?: string) {
  return useQuery({
    queryKey: tasksQueryKeys.all(projectId),
    queryFn: () => fetchAllTasks(projectId),
  });
}

export function useTasksForProject(projectId: string) {
  return useQuery({
    queryKey: tasksQueryKeys.byProject(projectId),
    queryFn: () => fetchTasksForProject(projectId),
    enabled: Boolean(projectId),
  });
}
