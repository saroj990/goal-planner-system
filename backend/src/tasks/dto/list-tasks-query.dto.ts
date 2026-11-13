import { IsOptional, IsString } from 'class-validator';

export class ListTasksQueryDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
