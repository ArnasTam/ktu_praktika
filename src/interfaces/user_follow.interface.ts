import { User } from '@interfaces/users.interface';

export interface UserFollow {
  id: number;
  followedUser: User;
  follower: User;
}
