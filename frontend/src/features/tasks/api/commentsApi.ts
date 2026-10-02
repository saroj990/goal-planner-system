import { apiRequest } from '../../../services/apiClient';
import type { CreateTaskCommentInput, TaskComment } from '../types';

export function fetchTaskComments(taskId: string): Promise<TaskComment[]> {
  return apiRequest<TaskComment[]>(`/tasks/${taskId}/comments`);
}

export function createTaskComment(
  taskId: string,
  input: CreateTaskCommentInput,
): Promise<TaskComment> {
  return apiRequest<TaskComment>(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteTaskComment(taskId: string, commentId: string): Promise<void> {
  return apiRequest<void>(`/tasks/${taskId}/comments/${commentId}`, {
    method: 'DELETE',
  });
}
