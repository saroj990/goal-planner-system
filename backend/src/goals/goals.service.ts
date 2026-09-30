import { Injectable, NotFoundException } from '@nestjs/common';
import { Goal, GoalStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { ListGoalsQueryDto } from './dto/list-goals-query.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateGoalDto): Promise<Goal> {
    const userId = await this.usersService.getDevUserId();
    return this.prisma.goal.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        priority: dto.priority,
      },
    });
  }

  async findAll(query: ListGoalsQueryDto): Promise<Goal[]> {
    const userId = await this.usersService.getDevUserId();
    const where: Prisma.GoalWhereInput = {
      userId,
      ...(query.type ? { type: query.type } : {}),
    };
    return this.prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Goal> {
    const userId = await this.usersService.getDevUserId();
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
    });
    if (!goal) {
      throw new NotFoundException(`Goal ${id} not found`);
    }
    return goal;
  }

  async update(id: string, dto: UpdateGoalDto): Promise<Goal> {
    await this.findOne(id);

    const data: Prisma.GoalUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.startDate !== undefined ? { startDate: new Date(dto.startDate) } : {}),
      ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
    };

    if (dto.status === GoalStatus.COMPLETED) {
      data.completedAt = new Date();
    } else if (dto.status !== undefined) {
      data.completedAt = null;
    }

    return this.prisma.goal.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.goal.delete({
      where: { id },
    });
  }
}
