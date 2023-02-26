import { CreatePostDto, GetFilteredPostsDto } from '@dtos/post.dto';
import { Comment } from '@interfaces/comment.interface';
import { Post } from '@interfaces/post.interface';
import AuthService from '@services/auth.service';
import PostService from '@services/post.service';
import { NextFunction, Request, Response } from 'express';

class PostController {
  public postService = new PostService();
  public authService = new AuthService();

  public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filterData: GetFilteredPostsDto = req.body;

      const findAllPosts: Post[] = await this.postService.findFilteredPosts(filterData);

      res.status(200).json({ data: findAllPosts, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const findPost: Post = await this.postService.findPostById(postId);

      res.status(200).json({ data: findPost, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const findComments: Comment[] = await this.postService.findAllPostComments(postId);

      res.status(200).json({ data: findComments, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postData: CreatePostDto = req.body;
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const userId = (await this.authService.getClaims(Authorization)).id;
      const createPostData: Post = await this.postService.createPost(postData, userId);

      res.status(201).json({ data: createPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const postData: CreatePostDto = req.body;
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const userId = (await this.authService.getClaims(Authorization)).id;
      const updatePostData: Post = await this.postService.updatePost(postId, userId, postData);

      res.status(200).json({ data: updatePostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const userId = (await this.authService.getClaims(Authorization)).id;
      const deletePostData: Post = await this.postService.deletePost(postId, userId);

      res.status(200).json({ data: deletePostData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
