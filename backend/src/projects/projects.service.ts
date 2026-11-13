import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project, ProjectStatus } from '@prisma/client';
import { isAdmin } from '../auth/access';
import { RequestUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(actor: RequestUser, dto: CreateProjectDto): Promise<Project> {
    this.assertAdmin(actor);
    return this.prisma.project.create({
      data: {
        userId: actor.id,
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        priority: dto.priority,
      },
    });
  }

  async findAll(actor: RequestUser): Promise<Project[]> {
    if (isAdmin(actor)) {
      return this.prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.project.findMany({
      where: {
        OR: [
          { userId: actor.id },
          { tasks: { some: { assigneeId: actor.id } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(actor: RequestUser, id: string): Promise<Project> {
    return this.assertProjectAccess(actor, id);
  }

  async update(actor: RequestUser, id: string, dto: UpdateProjectDto): Promise<Project> {
    this.assertAdmin(actor);
    await this.assertProjectAccess(actor, id);

    const data: Prisma.ProjectUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.startDate !== undefined ? { startDate: new Date(dto.startDate) } : {}),
      ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
    };

    if (dto.status === ProjectStatus.COMPLETED) {
      data.completedAt = new Date();
    } else if (dto.status !== undefined) {
      data.completedAt = null;
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(actor: RequestUser, id: string): Promise<void> {
    this.assertAdmin(actor);
    await this.assertProjectAccess(actor, id);
    await this.prisma.project.delete({
      where: { id },
    });
  }

  private assertAdmin(actor: RequestUser): void {
    if (!isAdmin(actor)) {
      throw new ForbiddenException('Only admin can manage projects');
    }
  }

  private async assertProjectAccess(actor: RequestUser, projectId: string): Promise<Project> {
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
    return project;
  }
}
