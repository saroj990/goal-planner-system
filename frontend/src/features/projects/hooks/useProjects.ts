import { useQuery } from '@tanstack/react-query';
import { fetchProject, fetchProjects } from '../api/projectsApi';

export const projectsQueryKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
};

export function useProjectsList() {
  return useQuery({
    queryKey: projectsQueryKeys.all,
    queryFn: fetchProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectsQueryKeys.detail(id),
    queryFn: () => fetchProject(id),
    enabled: Boolean(id),
  });
}
