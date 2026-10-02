import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export const TASK_COMMENT_MAX_LENGTH = 10_000;

export class CreateTaskCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(TASK_COMMENT_MAX_LENGTH)
  body!: string;
}
