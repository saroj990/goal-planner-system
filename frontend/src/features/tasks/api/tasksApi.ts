import { apiRequest } from '../../../services/apiClient';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types';

export function fetchAllTasks(filters?: { projectId?: string; assigneeId?: string }): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.projectId) params.set('projectId', filters.projectId);
  if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<Task[]>(`/tasks${query}`);
}

export function fetchTasksForProject(projectId: string): Promise<Task[]> {
  return apiRequest<Task[]>(`/projects/${projectId}/tasks`);
}

export function createTask(projectId: string, input: CreateTaskInput): Promise<Task> {
  return apiRequest<Task>(`/projects/${projectId}/tasks`, {
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
  projectId: string;
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
