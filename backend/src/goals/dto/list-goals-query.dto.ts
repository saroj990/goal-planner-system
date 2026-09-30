import { GoalType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListGoalsQueryDto {
  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType;
}
