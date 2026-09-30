import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, updateTask } from '../api/tasksApi';
import type { CreateTaskInput, UpdateTaskInput } from '../types';
import { tasksQueryKeys } from './useTasks';

export function useTaskMutations(goalId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: tasksQueryKeys.byGoal(goalId) });

  const create = useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(goalId, input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      updateTask(taskId, input),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
