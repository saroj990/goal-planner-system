import { Injectable, NotFoundException } from '@nestjs/common';
import { Project, ProjectStatus, Task, TaskStatus } from '@prisma/client';
import { isAdmin } from '../auth/access';
import { RequestUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardResponse {
  filterProjectId: string | null;
  projectsCompleted: number;
  projectsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionPercent: number;
  activeProjectsCount: number;
  overdueProjects: Project[];
  activeProjects: Project[];
  tasks: Task[];
  tasksByStatus: {
    todo: Task[];
    inProgress: Task[];
    blocked: Task[];
    done: Task[];
  };
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(actor: RequestUser, projectId?: string): Promise<DashboardResponse> {
    if (projectId) {
      const project = await this.prisma.project.findFirst({
        where: isAdmin(actor)
          ? { id: projectId }
          : {
              id: projectId,
              OR: [
                { userId: actor.id },
                { tasks: { some: { assigneeId: actor.id } } },
              ],
            },
      });
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }
    }

    const projects = await this.prisma.project.findMany({
      where: isAdmin(actor)
        ? {
            ...(projectId ? { id: projectId } : {}),
          }
        : {
            ...(projectId ? { id: projectId } : {}),
            OR: [
              { userId: actor.id },
              { tasks: { some: { assigneeId: actor.id } } },
            ],
          },
      orderBy: { updatedAt: 'desc' },
    });

    const projectIds = projects.map((p) => p.id);
    const tasks =
      projectIds.length === 0
        ? []
        : await this.prisma.task.findMany({
            where: {
              projectId: { in: projectIds },
              ...(isAdmin(actor) ? {} : { assigneeId: actor.id }),
            },
            orderBy: { position: 'asc' },
          });

    const projectsCompleted = projects.filter((p) => p.status === ProjectStatus.COMPLETED).length;
    const projectsTotal = projects.length;

    const tasksCompleted = tasks.filter((t) => t.status === TaskStatus.DONE).length;
    const tasksTotal = tasks.length;
    const completionPercent =
      tasksTotal === 0 ? 0 : Math.round((tasksCompleted / tasksTotal) * 100);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const overdueProjects = projects.filter(
      (p) => p.status === ProjectStatus.ACTIVE && p.dueDate && p.dueDate < startOfToday,
    );

    const activeProjectsCount = projects.filter((p) => p.status === ProjectStatus.ACTIVE).length;
    const activeProjects = projects.filter((p) => p.status === ProjectStatus.ACTIVE);

    const todo = tasks.filter((t) => t.status === TaskStatus.TODO);
    const inProgress = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS);
    const blocked = tasks.filter((t) => t.status === TaskStatus.BLOCKED);
    const done = tasks.filter((t) => t.status === TaskStatus.DONE);

    return {
      filterProjectId: projectId ?? null,
      projectsCompleted,
      projectsTotal,
      tasksCompleted,
      tasksTotal,
      completionPercent,
      activeProjectsCount,
      overdueProjects,
      activeProjects,
      tasks,
      tasksByStatus: { todo, inProgress, blocked, done },
    };
  }
}
