import { apiRequest } from '../../../services/apiClient';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types';

export function fetchAllTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks');
}

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

export interface ReorderTasksInput {
  goalId: string;
  items: { id: string; status: string; position: number }[];
}

export function reorderTasks(input: ReorderTasksInput): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks/reorder', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface ReorderBoardInput {
  items: { id: string; status: string; position: number }[];
}

export function reorderBoardTasks(input: ReorderBoardInput): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks/reorder-board', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
