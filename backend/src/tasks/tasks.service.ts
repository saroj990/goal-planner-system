import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const POSITION_STEP = 100;

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createForGoal(goalId: string, dto: CreateTaskDto): Promise<Task> {
    await this.assertGoalOwned(goalId);
    const position = await this.nextPosition(goalId);

    return this.prisma.task.create({
      data: {
        goalId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position,
      },
    });
  }

  async findByGoal(goalId: string): Promise<Task[]> {
    await this.assertGoalOwned(goalId);
    return this.prisma.task.findMany({
      where: { goalId },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(taskId: string): Promise<Task> {
    return this.assertTaskOwned(taskId);
  }

  async update(taskId: string, dto: UpdateTaskDto): Promise<Task> {
    await this.assertTaskOwned(taskId);

    const data: Prisma.TaskUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
    };

    if (dto.status === TaskStatus.DONE) {
      data.completedAt = new Date();
    } else if (dto.status !== undefined) {
      data.completedAt = null;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async remove(taskId: string): Promise<void> {
    await this.assertTaskOwned(taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
  }

  async reorder(dto: ReorderTasksDto): Promise<Task[]> {
    await this.assertGoalOwned(dto.goalId);
    const userId = await this.usersService.getDevUserId();
    const taskIds = dto.items.map((item) => item.id);

    const existing = await this.prisma.task.findMany({
      where: { id: { in: taskIds }, goalId: dto.goalId, goal: { userId } },
      select: { id: true },
    });

    if (existing.length !== dto.items.length) {
      throw new NotFoundException('One or more tasks not found for this goal');
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

    return this.findByGoal(dto.goalId);
  }

  private async nextPosition(goalId: string): Promise<number> {
    const last = await this.prisma.task.findFirst({
      where: { goalId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return last ? last.position + POSITION_STEP : POSITION_STEP;
  }

  private async assertGoalOwned(goalId: string): Promise<void> {
    const userId = await this.usersService.getDevUserId();
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });
    if (!goal) {
      throw new NotFoundException(`Goal ${goalId} not found`);
    }
  }

  private async assertTaskOwned(taskId: string): Promise<Task> {
    const userId = await this.usersService.getDevUserId();
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, goal: { userId } },
    });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
    return task;
  }
}
