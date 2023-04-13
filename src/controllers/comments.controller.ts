import { CommentDto, CreateCommentDto, UpdateCommentDto } from '@dtos/comments.dto';
import AuthService from '@services/auth.service';
import CommentsService from '@services/comments.service';
import { NextFunction, Request, Response } from 'express';

class CommentsController {
  public commentsService = new CommentsService();
  public authService = new AuthService();

  public getCommentsByPostId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.query.postId);
      const findAllComments: CommentDto[] = await this.commentsService.findAllCommentsByPostId(postId);

      res.status(200).json({ data: findAllComments, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCommentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentId = Number(req.params.id);
      const findComment: CommentDto = await this.commentsService.findCommentById(commentId);

      res.status(200).json({ data: findComment, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentData: CreateCommentDto = req.body;
      const userId = (await this.authService.getClaims(req)).tokenSubject;

      const createCommentData: CommentDto = await this.commentsService.createComment(commentData, userId);

      res.status(201).json({ data: createCommentData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentId = Number(req.params.id);
      const commentData: UpdateCommentDto = req.body;
      const userId = (await this.authService.getClaims(req)).tokenSubject;
      const updateCommentData: CommentDto = await this.commentsService.updateComment(commentId, userId, commentData);

      res.status(200).json({ data: updateCommentData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentId = Number(req.params.id);
      const userId = (await this.authService.getClaims(req)).tokenSubject;

      const deleteCommentData: CommentDto = await this.commentsService.deleteComment(commentId, userId);

      res.status(200).json({ data: deleteCommentData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CommentsController;
