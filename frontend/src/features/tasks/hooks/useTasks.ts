import { useQuery } from '@tanstack/react-query';
import { fetchAllTasks, fetchTasksForProject } from '../api/tasksApi';

export const tasksQueryKeys = {
  all: (filters?: { projectId?: string; assigneeId?: string }) =>
    ['tasks', 'all', filters?.projectId ?? null, filters?.assigneeId ?? null] as const,
  byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
};

export function useAllTasks(filters?: { projectId?: string; assigneeId?: string }) {
  return useQuery({
    queryKey: tasksQueryKeys.all(filters),
    queryFn: () => fetchAllTasks(filters),
  });
}

export function useTasksForProject(projectId: string) {
  return useQuery({
    queryKey: tasksQueryKeys.byProject(projectId),
    queryFn: () => fetchTasksForProject(projectId),
    enabled: Boolean(projectId),
  });
}
