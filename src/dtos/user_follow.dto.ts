import { UserDto } from '@dtos/users.dto';

export class UserFollowDto {
  public id: number;
  public followedUser: UserDto;
  public follower: UserDto;
}
