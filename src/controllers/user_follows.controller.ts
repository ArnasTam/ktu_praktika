import { UserFollow } from '@interfaces/user_follow.interface';
import AuthService from '@services/auth.service';
import UserFollowsService from '@services/user_follow.service';
import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';

class UserFollowsController {
  public followsService = new UserFollowsService();
  public authService = new AuthService();

  public unfollowUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const followerId = (await this.authService.getClaims(Authorization)).id;

      const unfollowData: UserFollow = await this.followsService.deleteFollow(userId, followerId);

      res.status(200).json({ data: unfollowData, message: 'unfollowed' });
    } catch (error) {
      next(error);
    }
  };

  public followUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const followerId = (await this.authService.getClaims(Authorization)).id;

      const follow: UserFollow = await this.followsService.createFollow(userId, followerId);

      res.status(200).json({ data: follow, message: 'followed' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserFollowsController;
