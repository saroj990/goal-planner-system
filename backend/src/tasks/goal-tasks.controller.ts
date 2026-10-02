import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/auth.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('goals/:goalId/tasks')
export class GoalTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: RequestUser,
    @Param('goalId') goalId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createForGoal(user.id, goalId, dto);
  }

  @Get()
  findByGoal(@CurrentUser() user: RequestUser, @Param('goalId') goalId: string) {
    return this.tasksService.findByGoal(user.id, goalId);
  }
}
