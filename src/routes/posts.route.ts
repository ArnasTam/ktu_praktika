import PostController from '@controllers/post.controller';
import { CreatePostDto, GetFilteredPostsDto } from '@dtos/post.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class PostsRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, validationMiddleware(GetFilteredPostsDto, 'body'), this.postController.getPosts);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.postController.getPostById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreatePostDto, 'body'), this.postController.createPost);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreatePostDto, 'body', true), this.postController.updatePost);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.postController.deletePost);
    this.router.get(`${this.path}/:id(\\d+)/comments`, authMiddleware, this.postController.getComments);
  }
}

export default PostsRoute;
