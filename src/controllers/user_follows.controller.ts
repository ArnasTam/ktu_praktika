import AuthService from '@services/auth.service';
import UserFollowsService from '@services/user_follow.service';
import { NextFunction, Request, Response } from 'express';

class UserFollowsController {
  public followsService = new UserFollowsService();
  public authService = new AuthService();

  public unfollowUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const followerId = (await this.authService.getClaims(req)).tokenSubject;

      await this.followsService.deleteFollow(userId, followerId);

      res.status(200).json({ message: 'unfollowed' });
    } catch (error) {
      next(error);
    }
  };

  public followUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const followerId = (await this.authService.getClaims(req)).tokenSubject;

      await this.followsService.createFollow(userId, followerId);

      res.status(200).json({ message: 'followed' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserFollowsController;
