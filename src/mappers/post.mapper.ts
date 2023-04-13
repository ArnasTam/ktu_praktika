import { mapToUserDto } from '@/mappers/user.mapper';
import { PostDto } from '@dtos/post.dto';
import { Post } from '@interfaces/post.interface';

// TODO: Move to class
export const mapToPostDto = (post: Post): PostDto => {
  return { content: post.content, id: post.id, title: post.title, author: mapToUserDto(post.author) };
};
