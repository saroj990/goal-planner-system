import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/auth.types';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { TaskCommentsService } from './task-comments.service';

@Controller('tasks/:taskId/comments')
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Param('taskId') taskId: string) {
    return this.taskCommentsService.listForTask(user.id, taskId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: RequestUser,
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskCommentDto,
  ) {
    return this.taskCommentsService.create(user.id, taskId, dto);
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: RequestUser,
    @Param('taskId') taskId: string,
    @Param('commentId') commentId: string,
  ) {
    await this.taskCommentsService.remove(user.id, taskId, commentId);
  }
}
