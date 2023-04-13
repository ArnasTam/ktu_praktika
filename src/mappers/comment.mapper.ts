import { mapToUserDto } from '@/mappers/user.mapper';
import { CommentDto } from '@dtos/comments.dto';
import { Comment } from '@interfaces/comment.interface';

// TODO: Move to class
export const mapToCommentDto = (comment: Comment): CommentDto => {
  return { content: comment.content, id: comment.id, author: comment.author && mapToUserDto(comment.author) };
};
