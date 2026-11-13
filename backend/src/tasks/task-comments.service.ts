import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskComment } from '@prisma/client';
import { isAdmin } from '../auth/access';
import { RequestUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { TaskCommentResponse } from './task-comments.types';

@Injectable()
export class TaskCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForTask(actor: RequestUser, taskId: string): Promise<TaskCommentResponse[]> {
    await this.assertTaskAccess(actor, taskId);
    const comments = await this.prisma.taskComment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true } } },
    });
    return comments.map((c) => this.toResponse(c));
  }

  async create(
    actor: RequestUser,
    taskId: string,
    dto: CreateTaskCommentDto,
  ): Promise<TaskCommentResponse> {
    await this.assertTaskAccess(actor, taskId);
    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        userId: actor.id,
        body: dto.body.trim(),
      },
      include: { user: { select: { id: true, name: true } } },
    });
    return this.toResponse(comment);
  }

  async remove(actor: RequestUser, taskId: string, commentId: string): Promise<void> {
    await this.assertTaskAccess(actor, taskId);
    const comment = await this.prisma.taskComment.findFirst({
      where: { id: commentId, taskId },
    });
    if (!comment) {
      throw new NotFoundException(`Comment ${commentId} not found`);
    }
    if (comment.userId !== actor.id && !isAdmin(actor)) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.prisma.taskComment.delete({ where: { id: commentId } });
  }

  private async assertTaskAccess(actor: RequestUser, taskId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: isAdmin(actor)
        ? { id: taskId }
        : {
            id: taskId,
            OR: [{ assigneeId: actor.id }, { project: { userId: actor.id } }],
          },
    });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
  }

  private toResponse(
    comment: TaskComment & { user: { id: string; name: string } },
  ): TaskCommentResponse {
    return {
      id: comment.id,
      taskId: comment.taskId,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: { id: comment.user.id, name: comment.user.name },
    };
  }
}
