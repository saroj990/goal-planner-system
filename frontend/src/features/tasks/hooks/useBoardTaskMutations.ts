import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, reorderBoardTasks, updateTask } from '../api/tasksApi';
import type { ReorderBoardInput } from '../api/tasksApi';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types';
import { tasksQueryKeys } from './useTasks';

export function useBoardTaskMutations() {
  const queryClient = useQueryClient();

  const invalidateBoard = () => {
    queryClient.invalidateQueries({ queryKey: tasksQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'goal'] });
  };

  const create = useMutation({
    mutationFn: ({ goalId, input }: { goalId: string; input: CreateTaskInput }) =>
      createTask(goalId, input),
    onSuccess: invalidateBoard,
  });

  const update = useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      updateTask(taskId, input),
    onSuccess: invalidateBoard,
  });

  const remove = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: invalidateBoard,
  });

  const reorder = useMutation({
    mutationFn: (input: ReorderBoardInput) => reorderBoardTasks(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKeys.all });
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKeys.all);
      if (previous) {
        const byId = new Map(previous.map((t) => [t.id, t]));
        const optimistic = input.items
          .map((item) => {
            const task = byId.get(item.id);
            if (!task) return null;
            return {
              ...task,
              status: item.status as Task['status'],
              position: item.position,
            };
          })
          .filter(Boolean) as Task[];
        queryClient.setQueryData(tasksQueryKeys.all, optimistic);
      }
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tasksQueryKeys.all, context.previous);
      }
    },
    onSettled: invalidateBoard,
  });

  return { create, update, remove, reorder };
}
