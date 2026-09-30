import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GoalTasksController } from './goal-tasks.controller';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [UsersModule],
  controllers: [GoalTasksController, TasksController],
  providers: [TasksService],
})
export class TasksModule {}
