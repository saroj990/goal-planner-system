import { Task, TaskPriority, TaskStatus } from '@prisma/client';

export interface TaskAssigneeSummary {
  id: string;
  name: string;
  email: string;
}

export interface TaskResponse extends Task {
  projectTitle?: string;
  assignee: TaskAssigneeSummary | null;
}

export type TaskWithRelations = Task & {
  project?: { title: string };
  assignee: TaskAssigneeSummary | null;
};

export function toTaskResponse(task: TaskWithRelations): TaskResponse {
  const { project, assignee, ...rest } = task;
  return {
    ...rest,
    ...(project ? { projectTitle: project.title } : {}),
    assignee: assignee ?? null,
  };
}

export const TASK_PRIORITY_ORDER: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const TASK_STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
