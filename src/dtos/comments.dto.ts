import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  public content: string;

  @IsInt()
  public postId: number;
}

export class UpdateCommentDto {
  @IsString()
  public content: string;
}
