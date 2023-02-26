import { CreateCommentDto, UpdateCommentDto } from '@dtos/comments.dto';
import { Comment } from '@interfaces/comment.interface';
import AuthService from '@services/auth.service';
import CommentsService from '@services/comments.service';
import { NextFunction, Request, Response } from 'express';

class CommentsController {
  public commentsService = new CommentsService();
  public authService = new AuthService();

  public getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllComments: Comment[] = await this.commentsService.findAllComments();

      res.status(200).json({ data: findAllComments, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCommentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentId = Number(req.params.id);
      const findComment: Comment = await this.commentsService.findCommentById(commentId);

      res.status(200).json({ data: findComment, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentData: CreateCommentDto = req.body;
      const cookie = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const userId = (await this.authService.getClaims(cookie)).id;

      const createCommentData: Comment = await this.commentsService.createComment(commentData, userId);

      res.status(201).json({ data: createCommentData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentId = Number(req.params.id);
      const commentData: UpdateCommentDto = req.body;
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const userId = (await this.authService.getClaims(Authorization)).id;

      const updateCommentData: Comment = await this.commentsService.updateComment(commentId, userId, commentData);

      res.status(200).json({ data: updateCommentData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentId = Number(req.params.id);
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const userId = (await this.authService.getClaims(Authorization)).id;

      const deleteCommentData: Comment = await this.commentsService.deleteComment(commentId, userId);

      res.status(200).json({ data: deleteCommentData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CommentsController;
