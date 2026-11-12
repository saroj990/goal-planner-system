import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, reorderTasks, updateTask } from '../api/tasksApi';
import type { ReorderTasksInput } from '../api/tasksApi';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types';
import { tasksQueryKeys } from './useTasks';

export function useTaskMutations(projectId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: tasksQueryKeys.byProject(projectId) });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'all'] });
  };

  const create = useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(projectId, input),
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
    mutationFn: (input: ReorderTasksInput) => reorderTasks(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKeys.byProject(projectId) });
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKeys.byProject(projectId));
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
        queryClient.setQueryData(tasksQueryKeys.byProject(projectId), optimistic);
      }
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tasksQueryKeys.byProject(projectId), context.previous);
      }
    },
    onSettled: invalidate,
  });

  return { create, update, remove, reorder };
}
