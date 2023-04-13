import SocketSingleton from '@/scokets/socket_singleton';
import { CreateMessageDto, UpdateMessageDto } from '@dtos/message.dto';
import { MessageEntity } from '@entities/message.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { Message } from '@interfaces/message.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { getRepository, Repository } from 'typeorm';

class MessageService {
  messageRepository: Repository<MessageEntity>;
  userRepository: Repository<UserEntity>;

  constructor(messageRepository?: Repository<MessageEntity>, userRepository?: Repository<UserEntity>) {
    this.messageRepository = messageRepository ?? getRepository(MessageEntity);
    this.userRepository = userRepository ?? getRepository(UserEntity);
  }

  // TODO: from/to change naming
  // TODO: add authority check
  public async getMessages(fromId: string, toId: string): Promise<Message[]> {
    if (isEmpty(fromId)) throw new HttpException(400, 'fromId is empty');
    if (isEmpty(toId)) throw new HttpException(400, 'toId is empty');

    const findFromUser: User = await this.userRepository.findOne({ where: { id: fromId } });
    if (!findFromUser) throw new HttpException(404, `A user with the specified fromId does not exist`);
    const findToUser: User = await this.userRepository.findOne({ where: { id: toId } });
    if (!findToUser) throw new HttpException(404, `A user with the specified toId does not exist`);

    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.from', 'from')
      .leftJoinAndSelect('message.to', 'to')
      .where('message.from.id = :fromId AND message.to.id = :toId', { fromId, toId })
      .orWhere('message.from.id = :toId AND message.to.id = :fromId', { fromId, toId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  public async createMessage(messageData: CreateMessageDto, authorId: string): Promise<Message> {
    if (isEmpty(messageData)) throw new HttpException(400, 'messageData is empty');
    if (isEmpty(authorId)) throw new HttpException(400, 'authorId is empty');

    const findFromUser: User = await this.userRepository.findOne({ where: { id: authorId } });
    if (!findFromUser) throw new HttpException(404, `A user with the specified author id does not exist`);
    const findToUser: User = await this.userRepository.findOne({ where: { id: messageData.toId } });
    if (!findToUser) throw new HttpException(404, `A recipient user with the specified id does not exist`);

    const savedMessage = await this.messageRepository.create({ content: messageData.content, from: findFromUser, to: findToUser }).save();

    SocketSingleton.getInstance().getIO().in(findToUser.id).emit('new_messages');

    return savedMessage;
  }

  public async updateMessage(messageId: number, callerId: string, messageData: UpdateMessageDto): Promise<Message> {
    if (isEmpty(messageData)) throw new HttpException(400, 'messageData is empty');
    if (isEmpty(callerId)) throw new HttpException(400, 'callerId is empty');
    if (isEmpty(messageId)) throw new HttpException(400, 'messageId is empty');

    const findMessage: Message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['from'] });
    if (!findMessage) throw new HttpException(409, "Message doesn't exist");
    // TODO: Admin can update
    if (findMessage.from.id !== callerId) throw new HttpException(403, 'No permission to update this message');

    await this.messageRepository.update(messageId, { ...messageData });

    return await this.messageRepository.findOne({ where: { id: messageId } });
  }

  public async deleteMessage(messageId: number, callerId: string): Promise<Message> {
    if (isEmpty(messageId)) throw new HttpException(400, 'messageId is empty');
    if (isEmpty(callerId)) throw new HttpException(400, 'callerId is empty');

    const findMessage: Message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['from'] });
    if (!findMessage) throw new HttpException(409, "Message doesn't exist");
    // TODO: Admin can delete
    if (findMessage.from.id !== callerId) throw new HttpException(403, 'No permission to update this message');

    await this.messageRepository.delete({ id: messageId });
    return findMessage;
  }
}

export default MessageService;
