import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGoal, deleteGoal, updateGoal } from '../api/goalsApi';
import type { CreateGoalInput, GoalType, UpdateGoalInput } from '../types';
import { goalsQueryKeys } from './useGoals';

export function useGoalMutations(typeFilter?: GoalType) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: goalsQueryKeys.all });
    if (typeFilter) {
      queryClient.invalidateQueries({ queryKey: goalsQueryKeys.list(typeFilter) });
    }
  };

  const create = useMutation({
    mutationFn: (input: CreateGoalInput) => createGoal(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGoalInput }) => updateGoal(id, input),
    onSuccess: (_data, variables) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: goalsQueryKeys.detail(variables.id) });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
