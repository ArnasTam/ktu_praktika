import { mapToUserFollowDto } from '@/mappers/user_follow.mapper';
import { UserFollowDto } from '@dtos/user_follow.dto';
import { UserFollowEntity } from '@entities/user_follow.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { UserFollow } from '@interfaces/user_follow.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

class UserFollowsService {
  public async getAllFollowers(userId: string): Promise<UserFollowDto[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, `A user with the specified userId does not exist`);

    return (await UserFollowEntity.find({ where: { followedUser: findUser }, relations: ['follower'] })).map(follow => mapToUserFollowDto(follow));
  }

  public async getAllFollowedUsers(userId: string): Promise<UserFollowDto[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, `A user with the specified userId does not exist`);

    return (await UserFollowEntity.find({ where: { follower: findUser }, relations: ['followedUser'] })).map(follow => mapToUserFollowDto(follow));
  }

  public async createFollow(userId: string, followerId: string): Promise<UserFollowDto> {
    const { findUser, findFollower } = await this.FindUsers(userId, followerId);

    if (await UserFollowEntity.findOne({ where: { followedUser: findUser, follower: findFollower } })) {
      throw new HttpException(404, `User is already being followed`);
    }

    return mapToUserFollowDto(await UserFollowEntity.create({ followedUser: findUser, follower: findFollower }).save());
  }

  public async deleteFollow(userId: string, followerId: string): Promise<UserFollowDto> {
    const { findUser, findFollower } = await this.FindUsers(userId, followerId);

    const follow: UserFollow = await UserFollowEntity.findOne({ where: { followedUser: findUser, follower: findFollower } });
    if (!follow) {
      throw new HttpException(404, `Cannot unfollow a user that is not followed`);
    }

    await UserFollowEntity.delete({ followedUser: findUser, follower: findFollower });
    return mapToUserFollowDto(follow);
  }

  private async FindUsers(userId: string, followerId: string) {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');
    if (isEmpty(followerId)) throw new HttpException(400, 'followerId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, `A user with the specified userId does not exist`);

    const findFollower: User = await UserEntity.findOne({ where: { id: followerId } });
    if (!findFollower) throw new HttpException(404, `A user with the specified followerId does not exist`);

    return { findUser, findFollower };
  }
}

export default UserFollowsService;
