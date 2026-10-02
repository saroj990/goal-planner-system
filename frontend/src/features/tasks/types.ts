export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export interface Task {
  id: string;
  goalId: string;
  goalTitle?: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: number | null;
  position: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskCommentAuthor {
  id: string;
  name: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: TaskCommentAuthor;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: number;
}

export interface CreateTaskCommentInput {
  body: string;
}
