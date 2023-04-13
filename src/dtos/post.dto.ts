import { UserDto } from '@dtos/users.dto';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  public title: string;

  @IsString()
  public content: string;
}

export class GetFilteredPostsDto {
  @IsInt()
  @IsOptional()
  public from: number;

  @IsInt()
  @IsOptional()
  public count: number;

  @IsDateString()
  @IsOptional()
  public fromDate?: Date;

  @IsDateString()
  @IsOptional()
  public toDate?: Date;
}

export class PostDto {
  public id: number;
  public title: string;
  public content: string;
  public author: UserDto;
}
