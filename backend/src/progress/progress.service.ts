import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProgressDayPoint {
  date: string;
  projects: number;
  tasks: number;
}

export interface ProgressResponse {
  days: ProgressDayPoint[];
}

const DEFAULT_DAYS = 30;
const MAX_DAYS = 90;

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(userId: string, days = DEFAULT_DAYS): Promise<ProgressResponse> {
    const span = Math.min(Math.max(days, 1), MAX_DAYS);
    const { start, keys } = dayRange(span);

    const projects = await this.prisma.project.findMany({
      where: {
        userId,
        completedAt: { gte: start },
      },
    });

    const projectIds = await this.prisma.project.findMany({
      where: { userId },
      select: { id: true },
    });
    const ids = projectIds.map((p) => p.id);
    const tasks =
      ids.length === 0
        ? []
        : await this.prisma.task.findMany({
            where: {
              projectId: { in: ids },
              completedAt: { gte: start },
            },
          });

    const points = keys.map((date) => ({
      date,
      projects: 0,
      tasks: 0,
    }));
    const byDate = new Map(points.map((p) => [p.date, p]));

    for (const project of projects) {
      if (!project.completedAt) continue;
      const key = toDateKey(project.completedAt);
      const point = byDate.get(key);
      if (point) point.projects += 1;
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
