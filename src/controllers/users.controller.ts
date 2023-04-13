import { UserFollowDto } from '@dtos/user_follow.dto';
import UserFollowsService from '@services/user_follow.service';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, UserDto } from '@dtos/users.dto';
import UserService from '@services/users.service';

class UsersController {
  public userService = new UserService();
  public followsService = new UserFollowsService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: UserDto[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: UserDto = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getFollowers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const followsData: UserFollowDto[] = await this.followsService.getAllFollowers(userId);
      const followers: UserDto[] = followsData.map(follow => follow.follower);

      res.status(200).json({ data: followers, message: 'getFollowers' });
    } catch (error) {
      next(error);
    }
  };

  public getFollowedUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const followsData: UserFollowDto[] = await this.followsService.getAllFollowedUsers(userId);
      const followers: UserDto[] = followsData.map(follow => follow.followedUser);

      res.status(200).json({ data: followers, message: 'getFollowedUsers' });
    } catch (error) {
      next(error);
    }
  };

  public createIfNotExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: UserDto = await this.userService.createIfNotExists(userData);

      res.status(201).json({ ...createUserData });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData: CreateUserDto = req.body;
      const updateUserData: UserDto = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const deleteUserData: UserDto = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
