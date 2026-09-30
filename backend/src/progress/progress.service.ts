import { Injectable } from '@nestjs/common';
import { GoalType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

export interface ProgressDayPoint {
  date: string;
  goals: { daily: number; weekly: number; monthly: number };
  tasks: number;
}

export interface ProgressResponse {
  days: ProgressDayPoint[];
}

const DEFAULT_DAYS = 30;
const MAX_DAYS = 90;

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getHistory(days = DEFAULT_DAYS): Promise<ProgressResponse> {
    const span = Math.min(Math.max(days, 1), MAX_DAYS);
    const userId = await this.usersService.getDevUserId();
    const { start, keys } = dayRange(span);

    const goals = await this.prisma.goal.findMany({
      where: {
        userId,
        completedAt: { gte: start },
      },
    });

    const goalIds = await this.prisma.goal.findMany({
      where: { userId },
      select: { id: true },
    });
    const ids = goalIds.map((g) => g.id);
    const tasks =
      ids.length === 0
        ? []
        : await this.prisma.task.findMany({
            where: {
              goalId: { in: ids },
              completedAt: { gte: start },
            },
          });

    const points = keys.map((date) => ({
      date,
      goals: { daily: 0, weekly: 0, monthly: 0 },
      tasks: 0,
    }));
    const byDate = new Map(points.map((p) => [p.date, p]));

    for (const goal of goals) {
      if (!goal.completedAt) continue;
      const key = toDateKey(goal.completedAt);
      const point = byDate.get(key);
      if (!point) continue;
      if (goal.type === GoalType.DAILY) point.goals.daily += 1;
      else if (goal.type === GoalType.WEEKLY) point.goals.weekly += 1;
      else point.goals.monthly += 1;
    }

    for (const task of tasks) {
      if (!task.completedAt) continue;
      const key = toDateKey(task.completedAt);
      const point = byDate.get(key);
      if (point) point.tasks += 1;
    }

    return { days: points };
  }
}

function dayRange(span: number): { start: Date; keys: string[] } {
  const keys: string[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (span - 1));

  const cursor = new Date(start);
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    keys.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return { start, keys };
}

function toDateKey(value: Date): string {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
