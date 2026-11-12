import { Module } from '@nestjs/common';
import { ProjectTasksController } from './project-tasks.controller';
import { TaskCommentsController } from './task-comments.controller';
import { TaskCommentsService } from './task-comments.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [ProjectTasksController, TaskCommentsController, TasksController],
  providers: [TasksService, TaskCommentsService],
})
export class TasksModule {}
