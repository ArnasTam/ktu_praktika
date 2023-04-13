import { CommentDto } from '@dtos/comments.dto';
import { CreatePostDto, PostDto } from '@dtos/post.dto';
import AuthService from '@services/auth.service';
import PostService from '@services/post.service';
import { NextFunction, Request, Response } from 'express';

class PostController {
  public postService = new PostService();
  public authService = new AuthService();

  public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllPosts: PostDto[] = await this.postService.findAllPosts();

      res.status(200).json({ data: findAllPosts, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const findPost: PostDto = await this.postService.findPostById(postId);

      res.status(200).json({ data: findPost, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const findComments: CommentDto[] = await this.postService.findAllPostComments(postId);

      res.status(200).json({ data: findComments, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postData: CreatePostDto = req.body;
      const userId = (await this.authService.getClaims(req)).tokenSubject;
      const createPostData: PostDto = await this.postService.createPost(postData, userId);

      res.status(201).json({ data: createPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const postData: CreatePostDto = req.body;
      const userId = (await this.authService.getClaims(req)).tokenSubject;
      const updatePostData: PostDto = await this.postService.updatePost(postId, userId, postData);

      res.status(200).json({ data: updatePostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.id);
      const userId = (await this.authService.getClaims(req)).tokenSubject;
      const deletePostData: PostDto = await this.postService.deletePost(postId, userId);

      res.status(200).json({ data: deletePostData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
