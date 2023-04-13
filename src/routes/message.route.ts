import MessageController from '@controllers/message.controller';
import { CreateMessageDto, UpdateMessageDto } from '@dtos/message.dto';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class MessageRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messageController = new MessageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.messageController.getMessages);
    this.router.post(`${this.path}`, validationMiddleware(CreateMessageDto, 'body'), this.messageController.createMessage);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(UpdateMessageDto, 'body', true), this.messageController.updateMessage);
    this.router.delete(`${this.path}/:id(\\d+)`, this.messageController.deleteMessage);
  }
}

export default MessageRoute;
