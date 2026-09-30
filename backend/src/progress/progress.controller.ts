import { Controller, Get, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ListProgressQueryDto } from './dto/list-progress-query.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@Query() query: ListProgressQueryDto) {
    return this.progressService.getHistory(query.days);
  }
}
