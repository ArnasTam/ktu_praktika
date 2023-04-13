import { UserDto } from '@dtos/users.dto';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  public content: string;

  @IsString()
  public toId: string;
}

export class UpdateMessageDto {
  @IsString()
  public content: string;
}

export class MessageDto {
  public id: number;
  public content: string;
  public from: UserDto;
}
