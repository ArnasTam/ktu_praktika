import { mapToCommentDto } from '@/mappers/comment.mapper';
import { CommentDto, CreateCommentDto, UpdateCommentDto } from '@dtos/comments.dto';
import { CommentEntity } from '@entities/comment.entity';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { Comment } from '@interfaces/comment.interface';
import { Post } from '@interfaces/post.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

class CommentsService {
  public async findAllCommentsByPostId(postId: number): Promise<CommentDto[]> {
    const comments = await CommentEntity.find({ where: { post: { id: postId } }, relations: ['author'] });
    return comments.map(comment => mapToCommentDto(comment));
  }

  public async findCommentById(commentId: number): Promise<CommentDto> {
    if (isEmpty(commentId)) throw new HttpException(400, 'CommentId is empty');

    const findComment: Comment = await CommentEntity.findOne({ where: { id: commentId } });
    if (!findComment) throw new HttpException(409, "Comment doesn't exist");

    return mapToCommentDto(findComment);
  }

  public async createComment(commentData: CreateCommentDto, authorId: string): Promise<CommentDto> {
    if (isEmpty(commentData)) throw new HttpException(400, 'commentData is empty');
    if (isEmpty(authorId)) throw new HttpException(400, 'authorId is empty');

    const findPost: Post = await PostEntity.findOne({ where: { id: commentData.postId } });
    if (!findPost) throw new HttpException(404, `A post with the specified id does not exist`);

    const findUser: User = await UserEntity.findOne({ where: { id: authorId } });
    if (!findUser) throw new HttpException(404, `A user with the specified authorId does not exist`);

    return mapToCommentDto(await CommentEntity.create({ ...commentData, author: findUser, post: findPost }).save());
  }

  public async updateComment(commentId: number, callerId: string, commentData: UpdateCommentDto): Promise<CommentDto> {
    if (isEmpty(commentData)) throw new HttpException(400, 'commentData is empty');

    const findComment: Comment = await CommentEntity.findOne({ where: { id: commentId }, relations: ['author'] });
    if (!findComment) throw new HttpException(409, "Comment doesn't exist");

    // TODO: Admin can update
    if (findComment.author.id !== callerId) throw new HttpException(403, 'No permission to update this comment');

    await CommentEntity.update(commentId, { ...commentData });

    return mapToCommentDto(await CommentEntity.findOne({ where: { id: commentId } }));
  }

  public async deleteComment(commentId: number, callerId: string): Promise<CommentDto> {
    if (isEmpty(commentId)) throw new HttpException(400, 'commentId is empty');

    const findComment: Comment = await CommentEntity.findOne({ where: { id: commentId }, relations: ['author'] });

    if (!findComment) throw new HttpException(409, "Comment doesn't exist");
    if (findComment.author.id !== callerId) throw new HttpException(403, 'No permission to delete this comment');

    await CommentEntity.delete({ id: commentId });
    return mapToCommentDto(findComment);
  }
}

export default CommentsService;
