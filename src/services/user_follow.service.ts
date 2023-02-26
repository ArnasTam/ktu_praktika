import { UserFollowEntity } from '@entities/user_follow.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { UserFollow } from '@interfaces/user_follow.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

class UserFollowsService {
  public async getAllFollowers(userId: number): Promise<UserFollow[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, `A user with the specified userId does not exist`);

    return await UserFollowEntity.find({ where: { followedUser: findUser }, relations: ['follower'] });
  }

  public async getAllFollowedUsers(userId: number): Promise<UserFollow[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, `A user with the specified userId does not exist`);

    return await UserFollowEntity.find({ where: { follower: findUser }, relations: ['followedUser'] });
  }

  public async createFollow(userId: number, followerId: number): Promise<UserFollow> {
    const { findUser, findFollower } = await this.FindUsers(userId, followerId);

    if (await UserFollowEntity.findOne({ where: { followedUser: findUser, follower: findFollower } })) {
      throw new HttpException(404, `User is already being followed`);
    }

    return await UserFollowEntity.create({ followedUser: findUser, follower: findFollower }).save();
  }

  public async deleteFollow(userId: number, followerId: number): Promise<UserFollow> {
    const { findUser, findFollower } = await this.FindUsers(userId, followerId);

    const follow: UserFollow = await UserFollowEntity.findOne({ where: { followedUser: findUser, follower: findFollower } });
    if (!follow) {
      throw new HttpException(404, `Cannot unfollow a user that is not followed`);
    }

    await UserFollowEntity.delete({ followedUser: findUser, follower: findFollower });
    return follow;
  }

  private async FindUsers(userId: number, followerId: number) {
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
