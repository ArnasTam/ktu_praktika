import { IsDate, IsDateString, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreatePostDto {
  @IsString()
  public title: string;

  @IsString()
  public content: string;
}

export class GetFilteredPostsDto {
  @IsInt()
  public from: number;

  @IsInt()
  public count: number;

  @IsDateString()
  @IsOptional()
  public fromDate?: Date;

  @IsDateString()
  @IsOptional()
  public toDate?: Date;
}
