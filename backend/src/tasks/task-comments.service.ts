import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskComment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { TaskCommentResponse } from './task-comments.types';

@Injectable()
export class TaskCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForTask(userId: string, taskId: string): Promise<TaskCommentResponse[]> {
    await this.assertTaskOwned(userId, taskId);
    const comments = await this.prisma.taskComment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true } } },
    });
    return comments.map((c) => this.toResponse(c));
  }

  async create(
    userId: string,
    taskId: string,
    dto: CreateTaskCommentDto,
  ): Promise<TaskCommentResponse> {
    await this.assertTaskOwned(userId, taskId);
    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        body: dto.body.trim(),
      },
      include: { user: { select: { id: true, name: true } } },
    });
    return this.toResponse(comment);
  }

  async remove(userId: string, taskId: string, commentId: string): Promise<void> {
    await this.assertTaskOwned(userId, taskId);
    const comment = await this.prisma.taskComment.findFirst({
      where: { id: commentId, taskId },
    });
    if (!comment) {
      throw new NotFoundException(`Comment ${commentId} not found`);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.prisma.taskComment.delete({ where: { id: commentId } });
  }

  private async assertTaskOwned(userId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, goal: { userId } },
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
