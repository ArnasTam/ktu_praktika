import UserFollowsController from '@controllers/user_follows.controller';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

class UserFollowsRoute implements Routes {
  public path = '/follows';
  public router = Router();
  public followsController = new UserFollowsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:id(\\d+)`, authMiddleware, this.followsController.followUser);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.followsController.unfollowUser);
  }
}

export default UserFollowsRoute;
