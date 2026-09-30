import { apiRequest } from '../../../services/apiClient';
import type { ProgressResponse } from '../types';

export function fetchProgress(days = 30): Promise<ProgressResponse> {
  return apiRequest<ProgressResponse>(`/progress?days=${days}`);
}
