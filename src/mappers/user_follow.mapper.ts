import { mapToUserDto } from '@/mappers/user.mapper';
import { UserFollowDto } from '@dtos/user_follow.dto';
import { UserFollow } from '@interfaces/user_follow.interface';

// TODO: Move to class
export const mapToUserFollowDto = (follow: UserFollow): UserFollowDto => {
  return {
    followedUser: follow.followedUser && mapToUserDto(follow.followedUser),
    follower: follow.follower && mapToUserDto(follow.follower),
    id: follow.id,
  };
};
