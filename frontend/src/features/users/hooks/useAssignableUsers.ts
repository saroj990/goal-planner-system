import { useQuery } from '@tanstack/react-query';
import { fetchAssignableUsers } from '../api/usersApi';

export const assignableUsersQueryKey = ['users', 'assignable'] as const;

export function useAssignableUsers() {
  return useQuery({
    queryKey: assignableUsersQueryKey,
    queryFn: fetchAssignableUsers,
  });
}
