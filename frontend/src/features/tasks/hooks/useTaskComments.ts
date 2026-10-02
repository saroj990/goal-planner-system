import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as commentsApi from '../api/commentsApi';
import type { CreateTaskCommentInput } from '../types';

export const taskCommentsQueryKeys = {
  byTask: (taskId: string) => ['tasks', taskId, 'comments'] as const,
};

export function useTaskComments(taskId: string, enabled: boolean) {
  return useQuery({
    queryKey: taskCommentsQueryKeys.byTask(taskId),
    queryFn: () => commentsApi.fetchTaskComments(taskId),
    enabled: enabled && Boolean(taskId),
  });
}

export function useTaskCommentMutations(taskId: string) {
  const queryClient = useQueryClient();
  const queryKey = taskCommentsQueryKeys.byTask(taskId);

  const create = useMutation({
    mutationFn: (input: CreateTaskCommentInput) => commentsApi.createTaskComment(taskId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const remove = useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteTaskComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { create, remove };
}
