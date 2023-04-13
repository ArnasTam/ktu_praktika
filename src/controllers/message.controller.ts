import { CreateMessageDto, UpdateMessageDto } from '@dtos/message.dto';
import { Message } from '@interfaces/message.interface';
import AuthService from '@services/auth.service';
import MessageService from '@services/message.service';
import { NextFunction, Request, Response } from 'express';

class MessageController {
  public messageService = new MessageService();
  public authService = new AuthService();

  public getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const from = String(req.query.from);
      const to = String(req.query.to);
      const findMessages: Message[] = await this.messageService.getMessages(from, to);

      res.status(200).json({ data: findMessages, message: 'getMessages' });
    } catch (error) {
      next(error);
    }
  };

  public createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageData: CreateMessageDto = req.body;
      const userId = (await this.authService.getClaims(req)).tokenSubject;

      const createCommentData: Message = await this.messageService.createMessage(messageData, userId);

      res.status(201).json({ data: createCommentData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageId = Number(req.params.id);
      const messageData: UpdateMessageDto = req.body;
      const userId = (await this.authService.getClaims(req)).tokenSubject;

      const message: Message = await this.messageService.updateMessage(messageId, userId, messageData);

      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  };

  public deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageId = Number(req.params.id);
      const userId = (await this.authService.getClaims(req)).tokenSubject;

      const message: Message = await this.messageService.deleteMessage(messageId, userId);

      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  };
}

export default MessageController;
