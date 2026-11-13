import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { isAdmin } from '../auth/access';
import { RequestUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderBoardDto } from './dto/reorder-board.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse, toTaskResponse } from './task.types';

const POSITION_STEP = 100;

const taskInclude = {
  project: { select: { title: true } },
  assignee: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TaskInclude;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createForProject(
    actor: RequestUser,
    projectId: string,
    dto: CreateTaskDto,
  ): Promise<TaskResponse> {
    await this.assertProjectManage(actor, projectId);
    const assigneeId =
      dto.assigneeId === null
        ? null
        : await this.resolveAssigneeId(dto.assigneeId ?? actor.id);
    const position = await this.nextPosition(projectId);

    const task = await this.prisma.task.create({
      data: {
        projectId,
        assigneeId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position,
      },
      include: taskInclude,
    });
    return toTaskResponse(task);
  }

  async findByProject(actor: RequestUser, projectId: string): Promise<TaskResponse[]> {
    await this.assertProjectView(actor, projectId);
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
        ...(isAdmin(actor) ? {} : { assigneeId: actor.id }),
      },
      orderBy: { position: 'asc' },
      include: taskInclude,
    });
    return tasks.map(toTaskResponse);
  }

  async findAllForUser(
    actor: RequestUser,
    projectId?: string,
    assigneeId?: string,
  ): Promise<TaskResponse[]> {
    if (projectId) {
      await this.assertProjectView(actor, projectId);
    }

    const where: Prisma.TaskWhereInput = {
      ...(projectId ? { projectId } : {}),
    };

    if (isAdmin(actor)) {
      if (assigneeId) where.assigneeId = assigneeId;
    } else {
      where.OR = [{ assigneeId: actor.id }, { project: { userId: actor.id } }];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: [{ position: 'asc' }, { updatedAt: 'asc' }],
      include: taskInclude,
    });
    return tasks.map(toTaskResponse);
  }

  async findOne(actor: RequestUser, taskId: string): Promise<TaskResponse> {
    const task = await this.assertTaskAccess(actor, taskId);
    const full = await this.prisma.task.findUniqueOrThrow({
      where: { id: task.id },
      include: taskInclude,
    });
    return toTaskResponse(full);
  }

  async update(actor: RequestUser, taskId: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    const existing = await this.assertTaskAccess(actor, taskId);
    const canManage = isAdmin(actor) || existing.project.userId === actor.id;

    if (!canManage) {
      const allowedKeys = ['status'] as const;
      const forbidden = Object.keys(dto).filter(
        (key) => dto[key as keyof UpdateTaskDto] !== undefined && !allowedKeys.includes(key as 'status'),
      );
      if (forbidden.length > 0) {
        throw new ForbiddenException('Members can only update status on assigned tasks');
      }
    }

    const data: Prisma.TaskUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
    };

    if (dto.assigneeId !== undefined) {
      if (!canManage) {
        throw new ForbiddenException('Only admin can reassign tasks');
      }
      if (dto.assigneeId === null) {
        data.assignee = { disconnect: true };
      } else {
        const nextAssigneeId = await this.resolveAssigneeId(dto.assigneeId);
        data.assignee = { connect: { id: nextAssigneeId } };
      }
    }

    if (dto.status === TaskStatus.DONE) {
      data.completedAt = new Date();
    } else if (dto.status !== undefined) {
      data.completedAt = null;
    }

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data,
      include: taskInclude,
    });
    return toTaskResponse(task);
  }

  async remove(actor: RequestUser, taskId: string): Promise<void> {
    const task = await this.assertTaskAccess(actor, taskId);
    if (!isAdmin(actor) && task.project.userId !== actor.id) {
      throw new ForbiddenException('Only admin can delete tasks');
    }
    await this.prisma.task.delete({ where: { id: taskId } });
  }

  async reorder(actor: RequestUser, dto: ReorderTasksDto): Promise<TaskResponse[]> {
    await this.assertProjectManage(actor, dto.projectId);
    const taskIds = dto.items.map((item) => item.id);

    const existing = await this.prisma.task.findMany({
      where: { id: { in: taskIds }, projectId: dto.projectId },
      select: { id: true },
    });

    if (existing.length !== dto.items.length) {
      throw new NotFoundException('One or more tasks not found for this project');
    }

    const uniquePositions = new Set(dto.items.map((item) => item.position));
    if (uniquePositions.size !== dto.items.length) {
      throw new BadRequestException('Task positions must be unique');
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.task.update({
          where: { id: item.id },
          data: {
            status: item.status,
            position: item.position,
            completedAt: item.status === TaskStatus.DONE ? new Date() : null,
          },
        }),
      ),
    );

    return this.findByProject(actor, dto.projectId);
  }

  async reorderBoard(actor: RequestUser, dto: ReorderBoardDto): Promise<TaskResponse[]> {
    const taskIds = dto.items.map((item) => item.id);

    const existing = await this.prisma.task.findMany({
      where: isAdmin(actor)
        ? { id: { in: taskIds } }
        : {
            id: { in: taskIds },
            OR: [{ assigneeId: actor.id }, { project: { userId: actor.id } }],
          },
      select: { id: true },
    });

    if (existing.length !== dto.items.length) {
      throw new NotFoundException('One or more tasks not found');
    }

    const uniquePositions = new Set(dto.items.map((item) => item.position));
    if (uniquePositions.size !== dto.items.length) {
      throw new BadRequestException('Task positions must be unique');
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.task.update({
          where: { id: item.id },
          data: {
            status: item.status,
            position: item.position,
            completedAt: item.status === TaskStatus.DONE ? new Date() : null,
          },
        }),
      ),
    );

    return this.findAllForUser(actor);
  }

  private async resolveAssigneeId(assigneeId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: assigneeId } });
    if (!user) {
      throw new BadRequestException('Assignee user not found');
    }
    return user.id;
  }

  private async nextPosition(projectId: string): Promise<number> {
    const last = await this.prisma.task.findFirst({
      where: { projectId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return last ? last.position + POSITION_STEP : POSITION_STEP;
  }

  private async assertProjectManage(actor: RequestUser, projectId: string): Promise<void> {
    if (!isAdmin(actor)) {
      throw new ForbiddenException('Only admin can manage project tasks');
    }
    const project = await this.prisma.project.findFirst({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
  }

  private async assertProjectView(actor: RequestUser, projectId: string): Promise<void> {
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

  private async assertTaskAccess(
    actor: RequestUser,
    taskId: string,
  ): Promise<Task & { project: { userId: string } }> {
    const task = await this.prisma.task.findFirst({
      where: isAdmin(actor)
        ? { id: taskId }
        : {
            id: taskId,
            OR: [{ assigneeId: actor.id }, { project: { userId: actor.id } }],
          },
      include: { project: { select: { userId: true } } },
    });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
    return task;
  }
}
