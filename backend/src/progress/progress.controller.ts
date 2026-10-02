import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/auth.types';
import { ListProgressQueryDto } from './dto/list-progress-query.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@CurrentUser() user: RequestUser, @Query() query: ListProgressQueryDto) {
    return this.progressService.getHistory(user.id, query.days);
  }
}
