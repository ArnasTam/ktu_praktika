import { CreatePostDto, GetFilteredPostsDto } from '@dtos/post.dto';
import { CommentEntity } from '@entities/comment.entity';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { Comment } from '@interfaces/comment.interface';
import { Post } from '@interfaces/post.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { getRepository } from 'typeorm';

class PostService {
  public async findAllPosts(): Promise<Post[]> {
    return await PostEntity.find();
  }

  public async findFilteredPosts(filterData: GetFilteredPostsDto): Promise<Post[]> {
    return await getRepository(PostEntity)
      .createQueryBuilder('post')
      .where(`post.updatedAt BETWEEN :fromDate AND :toDate`)
      .setParameters({ fromDate: filterData.fromDate, toDate: filterData.toDate })
      .skip(filterData.from)
      .take(filterData.count)
      .getMany();
  }

  public async findAllPostComments(postId: number): Promise<Comment[]> {
    if (isEmpty(postId)) throw new HttpException(400, 'PostId is empty');

    const findPost: Post = await PostEntity.findOne({ where: { id: postId } });
    if (!findPost) throw new HttpException(404, `A post with the specified id does not exist`);

    return await CommentEntity.find({ where: { post: findPost } });
  }

  public async findPostById(postId: number): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'PostId is empty');

    const findPost: Post = await PostEntity.findOne({ where: { id: postId } });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    return findPost;
  }

  public async createPost(postData: CreatePostDto, authorId: number): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
    if (isEmpty(authorId)) throw new HttpException(400, 'authorId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: authorId } });
    if (!findUser) throw new HttpException(404, `A user with the specified authorId does not exist`);

    return await PostEntity.create({ ...postData, author: findUser }).save();
  }

  public async updatePost(postId: number, callerId: number, postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const findPost: Post = await PostEntity.findOne({ where: { id: postId }, relations: ['author'] });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");
    // TODO: Admin can update
    if (findPost.author.id !== callerId) throw new HttpException(403, 'No permission to update this post');

    await PostEntity.update(postId, { ...postData });

    return await PostEntity.findOne({ where: { id: postId } });
  }

  public async deletePost(postId: number, callerId: number): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'PostId is empty');

    const findPost: Post = await PostEntity.findOne({ where: { id: postId }, relations: ['author'] });

    if (!findPost) throw new HttpException(409, "Post doesn't exist");
    if (findPost.author.id !== callerId) throw new HttpException(403, 'No permission to delete this post');

    await PostEntity.delete({ id: postId });
    return findPost;
  }
}

export default PostService;
