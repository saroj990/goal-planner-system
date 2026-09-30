export enum GoalType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: GoalType;
  startDate: string | null;
  dueDate: string | null;
  status: GoalStatus;
  priority: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateGoalInput {
  title: string;
  type: GoalType;
  description?: string;
  startDate?: string;
  dueDate?: string;
  priority?: number;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  type?: GoalType;
  status?: GoalStatus;
  startDate?: string;
  dueDate?: string;
  priority?: number;
}
