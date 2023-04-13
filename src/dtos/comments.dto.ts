import { UserDto } from '@dtos/users.dto';
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

export class CommentDto {
  public id: number;
  public content: string;
  public author?: UserDto;
}
