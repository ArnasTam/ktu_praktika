import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public id: string;

  @IsEmail()
  public email: string;

  @IsString()
  public about?: string;
}

export class UserLoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class UserDto {
  public id: string;
  public email: string;
  public createdAt: Date;
  public about: string;
}
