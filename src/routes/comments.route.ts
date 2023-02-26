import CommentsController from '@controllers/comments.controller';
import { CreateCommentDto, UpdateCommentDto } from '@dtos/comments.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CommentsRoute implements Routes {
  public path = '/comments';
  public router = Router();
  public commentsController = new CommentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.commentsController.getComments);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.commentsController.getCommentById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateCommentDto, 'body'), this.commentsController.createComment);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(UpdateCommentDto, 'body'), this.commentsController.updateComment);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.commentsController.deleteComment);
  }
}

export default CommentsRoute;
