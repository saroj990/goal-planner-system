import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, reorderBoardTasks, updateTask } from '../api/tasksApi';
import type { CreateTaskInput, UpdateTaskInput } from '../types';

export function useBoardTaskMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const create = useMutation({
    mutationFn: ({ projectId, input }: { projectId: string; input: CreateTaskInput }) =>
      createTask(projectId, input),
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

  const reorder = useMutation({
    mutationFn: reorderBoardTasks,
    onSuccess: invalidate,
  });

  return { create, update, remove, reorder };
}
