import { apiRequest } from '../../../services/apiClient';
import type { CreateGoalInput, Goal, GoalType, UpdateGoalInput } from '../types';

export function fetchGoals(type?: GoalType): Promise<Goal[]> {
  const query = type ? `?type=${type}` : '';
  return apiRequest<Goal[]>(`/goals${query}`);
}

export function fetchGoal(id: string): Promise<Goal> {
  return apiRequest<Goal>(`/goals/${id}`);
}

export function createGoal(input: CreateGoalInput): Promise<Goal> {
  return apiRequest<Goal>('/goals', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateGoal(id: string, input: UpdateGoalInput): Promise<Goal> {
  return apiRequest<Goal>(`/goals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteGoal(id: string): Promise<void> {
  return apiRequest<void>(`/goals/${id}`, { method: 'DELETE' });
}
