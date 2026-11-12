import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task, TaskStatus } from '@prisma/client';
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

  async createForProject(userId: string, projectId: string, dto: CreateTaskDto): Promise<TaskResponse> {
    await this.assertProjectOwned(userId, projectId);
    const assigneeId =
      dto.assigneeId === null
        ? null
        : await this.resolveAssigneeId(dto.assigneeId ?? userId);
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

  async findByProject(userId: string, projectId: string): Promise<TaskResponse[]> {
    await this.assertProjectOwned(userId, projectId);
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: { position: 'asc' },
      include: taskInclude,
    });
    return tasks.map(toTaskResponse);
  }

  async findAllForUser(userId: string, projectId?: string): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        project: {
          userId,
          ...(projectId ? { id: projectId } : {}),
        },
      },
      orderBy: [{ position: 'asc' }, { updatedAt: 'asc' }],
      include: taskInclude,
    });
    return tasks.map(toTaskResponse);
  }

  async findOne(userId: string, taskId: string): Promise<TaskResponse> {
    const task = await this.assertTaskOwned(userId, taskId);
    const full = await this.prisma.task.findUniqueOrThrow({
      where: { id: task.id },
      include: taskInclude,
    });
    return toTaskResponse(full);
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    await this.assertTaskOwned(userId, taskId);

    const data: Prisma.TaskUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
    };

    if (dto.assigneeId !== undefined) {
      if (dto.assigneeId === null) {
        data.assignee = { disconnect: true };
      } else {
        const assigneeId = await this.resolveAssigneeId(dto.assigneeId);
        data.assignee = { connect: { id: assigneeId } };
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

  async remove(userId: string, taskId: string): Promise<void> {
    await this.assertTaskOwned(userId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
  }

  async reorder(userId: string, dto: ReorderTasksDto): Promise<TaskResponse[]> {
    await this.assertProjectOwned(userId, dto.projectId);
    const taskIds = dto.items.map((item) => item.id);

    const existing = await this.prisma.task.findMany({
      where: { id: { in: taskIds }, projectId: dto.projectId, project: { userId } },
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

    return this.findByProject(userId, dto.projectId);
  }

  async reorderBoard(userId: string, dto: ReorderBoardDto): Promise<TaskResponse[]> {
    const taskIds = dto.items.map((item) => item.id);

    const existing = await this.prisma.task.findMany({
      where: { id: { in: taskIds }, project: { userId } },
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

    return this.findAllForUser(userId);
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

  private async assertProjectOwned(userId: string, projectId: string): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
  }

  private async assertTaskOwned(userId: string, taskId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, project: { userId } },
    });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
    return task;
  }
}
