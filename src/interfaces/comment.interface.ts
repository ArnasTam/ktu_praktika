import { Post } from '@interfaces/post.interface';
import { User } from '@interfaces/users.interface';

export interface Comment {
  id: number;
  content: string;
  author: User;
  post: Post;
}
