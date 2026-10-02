import { Module } from '@nestjs/common';
import { GoalTasksController } from './goal-tasks.controller';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [GoalTasksController, TasksController],
  providers: [TasksService],
})
export class TasksModule {}
