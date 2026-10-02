import { Module } from '@nestjs/common';
import { GoalTasksController } from './goal-tasks.controller';
import { TaskCommentsController } from './task-comments.controller';
import { TaskCommentsService } from './task-comments.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [GoalTasksController, TaskCommentsController, TasksController],
  providers: [TasksService, TaskCommentsService],
})
export class TasksModule {}
