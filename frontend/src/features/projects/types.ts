export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  startDate: string | null;
  dueDate: string | null;
  status: ProjectStatus;
  priority: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  priority?: number;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  dueDate?: string;
  priority?: number;
}
