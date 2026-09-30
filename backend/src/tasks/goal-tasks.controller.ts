import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('goals/:goalId/tasks')
export class GoalTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Param('goalId') goalId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.createForGoal(goalId, dto);
  }

  @Get()
  findByGoal(@Param('goalId') goalId: string) {
    return this.tasksService.findByGoal(goalId);
  }
}
