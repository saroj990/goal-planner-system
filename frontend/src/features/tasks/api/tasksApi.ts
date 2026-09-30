import { apiRequest } from '../../../services/apiClient';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types';

export function fetchTasksForGoal(goalId: string): Promise<Task[]> {
  return apiRequest<Task[]>(`/goals/${goalId}/tasks`);
}

export function createTask(goalId: string, input: CreateTaskInput): Promise<Task> {
  return apiRequest<Task>(`/goals/${goalId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTask(taskId: string): Promise<void> {
  return apiRequest<void>(`/tasks/${taskId}`, { method: 'DELETE' });
}
