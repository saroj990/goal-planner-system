import { Injectable } from '@nestjs/common';
import { Goal, GoalStatus, GoalType, Task, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

export interface DashboardResponse {
  goalsCompleted: number;
  goalsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionPercent: number;
  activeGoalsCount: number;
  overdueGoals: Goal[];
  todaysGoals: Goal[];
  todaysTasks: Task[];
  tasksByStatus: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getSummary(): Promise<DashboardResponse> {
    const userId = await this.usersService.getDevUserId();
    const { start, end } = dayBounds();

    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const goalIds = goals.map((g) => g.id);
    const tasks =
      goalIds.length === 0
        ? []
        : await this.prisma.task.findMany({
            where: { goalId: { in: goalIds } },
          });

    const dailyGoals = goals.filter((g) => g.type === GoalType.DAILY);
    const todaysGoals = dailyGoals.filter(
      (g) => g.status === GoalStatus.ACTIVE || completedBetween(g.completedAt, start, end),
    );

    const goalsCompleted = todaysGoals.filter(
      (g) => g.status === GoalStatus.COMPLETED || completedBetween(g.completedAt, start, end),
    ).length;
    const goalsTotal = todaysGoals.length;

    const dailyGoalIds = new Set(dailyGoals.map((g) => g.id));
    const todaysTasks = tasks.filter((t) => dailyGoalIds.has(t.goalId));
    const tasksCompleted = todaysTasks.filter(
      (t) => t.status === TaskStatus.DONE || completedBetween(t.completedAt, start, end),
    ).length;
    const tasksTotal = todaysTasks.length;

    const denominator = goalsTotal + tasksTotal;
    const numerator = goalsCompleted + tasksCompleted;
    const completionPercent = denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);

    const overdueGoals = goals.filter(
      (g) =>
        g.status === GoalStatus.ACTIVE &&
        g.dueDate &&
        g.dueDate < start,
    );

    const activeGoalsCount = goals.filter((g) => g.status === GoalStatus.ACTIVE).length;

    const todo = todaysTasks.filter((t) => t.status === TaskStatus.TODO);
    const inProgress = todaysTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS);
    const done = todaysTasks.filter((t) => t.status === TaskStatus.DONE);

    return {
      goalsCompleted,
      goalsTotal,
      tasksCompleted,
      tasksTotal,
      completionPercent,
      activeGoalsCount,
      overdueGoals,
      todaysGoals: todaysGoals.filter((g) => g.status === GoalStatus.ACTIVE),
      todaysTasks,
      tasksByStatus: { todo, inProgress, done },
    };
  }
}

function dayBounds(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function completedBetween(value: Date | null, start: Date, end: Date): boolean {
  if (!value) return false;
  return value >= start && value <= end;
}
