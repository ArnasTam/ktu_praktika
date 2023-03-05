import { CreatePostDto, GetFilteredPostsDto } from '@dtos/post.dto';
import { CommentEntity } from '@entities/comment.entity';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { Comment } from '@interfaces/comment.interface';
import { Post } from '@interfaces/post.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { getRepository, Repository } from 'typeorm';

class PostService {
  postRepository: Repository<PostEntity>;
  commentRepository: Repository<CommentEntity>;
  userRepository: Repository<UserEntity>;

  constructor(postRepository?: Repository<PostEntity>, commentRepository?: Repository<CommentEntity>, userRepository?: Repository<UserEntity>) {
    this.postRepository = postRepository ?? getRepository(PostEntity);
    this.commentRepository = commentRepository ?? getRepository(CommentEntity);
    this.userRepository = userRepository ?? getRepository(UserEntity);
  }

  public async findAllPosts(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  public async findFilteredPosts(filterData: GetFilteredPostsDto): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .where(`post.updatedAt BETWEEN :fromDate AND :toDate`)
      .setParameters({ fromDate: filterData.fromDate, toDate: filterData.toDate })
      .skip(filterData.from)
      .take(filterData.count)
      .getMany();
  }

  // TODO: Move to comments service
  public async findAllPostComments(postId: number): Promise<Comment[]> {
    if (isEmpty(postId)) throw new HttpException(400, 'PostId is empty');

    const findPost: Post = await this.postRepository.findOne({ where: { id: postId } });
    if (!findPost) throw new HttpException(404, `A post with the specified id does not exist`);

    return await this.commentRepository.find({ where: { post: findPost } });
  }

  public async findPostById(postId: number): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'PostId is empty');

    const findPost: Post = await this.postRepository.findOne({ where: { id: postId } });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    return findPost;
  }

  public async createPost(postData: CreatePostDto, authorId: number): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
    if (isEmpty(authorId)) throw new HttpException(400, 'authorId is empty');

    const findUser: User = await this.userRepository.findOne({ where: { id: authorId } });
    if (!findUser) throw new HttpException(404, `A user with the specified authorId does not exist`);

    return await this.postRepository.create({ ...postData, author: findUser }).save();
  }

  public async updatePost(postId: number, callerId: number, postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
    if (isEmpty(callerId)) throw new HttpException(400, 'callerId is empty');
    if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');

    const findPost: Post = await this.postRepository.findOne({ where: { id: postId }, relations: ['author'] });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");
    // TODO: Admin can update
    if (findPost.author.id !== callerId) throw new HttpException(403, 'No permission to update this post');

    await this.postRepository.update(postId, { ...postData });

    return await this.postRepository.findOne({ where: { id: postId } });
  }

  public async deletePost(postId: number, callerId: number): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');
    if (isEmpty(callerId)) throw new HttpException(400, 'callerId is empty');

    const findPost: Post = await this.postRepository.findOne({ where: { id: postId }, relations: ['author'] });

    if (!findPost) throw new HttpException(409, "Post doesn't exist");
    if (findPost.author.id !== callerId) throw new HttpException(403, 'No permission to delete this post');

    await this.postRepository.delete({ id: postId });
    return findPost;
  }
}

export default PostService;
