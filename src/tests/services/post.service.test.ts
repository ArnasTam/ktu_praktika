import { PostEntity } from '@entities/post.entity';
import PostService from '@services/post.service';
import { CommentEntity } from '@entities/comment.entity';
import { UserEntity } from 'entities/users.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import genMockFromModule = jest.genMockFromModule;
import fn = jest.fn;

describe('PostService', () => {
  let postService: PostService;
  let mockPostRepository: Repository<PostEntity>;
  let mockCommentRepository: Repository<CommentEntity>;
  let mockUserRepostory: Repository<UserEntity>;

  const mockPosts: PostEntity[] = [
    { id: 1, title: 'Post 1', content: 'This is post 1', author: { id: 1 } } as PostEntity,
    { id: 2, title: 'Post 2', content: 'This is post 2', author: { id: 2 } } as PostEntity,
    { id: 3, title: 'Post 3', content: 'This is post 3', author: { id: 3 } } as PostEntity,
  ];

  beforeEach(() => {
    mockPostRepository = genMockFromModule<Repository<PostEntity>>('typeorm');
    mockCommentRepository = genMockFromModule<Repository<CommentEntity>>('typeorm');
    mockUserRepostory = genMockFromModule<Repository<UserEntity>>('typeorm');
    postService = new PostService(mockPostRepository, mockCommentRepository, mockUserRepostory);
  });

  describe('findAllPosts', () => {
    it('should return an array of posts', async () => {
      mockPostRepository.find = fn().mockResolvedValue(mockPosts);

      const posts = await postService.findAllPosts();

      expect(posts).toEqual(mockPosts);
    });
  });

  describe('findFilteredPosts', () => {
    it('should return an array of posts', async () => {
      mockPostRepository.createQueryBuilder = fn(
        () =>
          ({
            where: fn().mockReturnThis(),
            setParameters: fn().mockReturnThis(),
            skip: fn().mockReturnThis(),
            take: fn().mockReturnThis(),
            getMany: fn().mockResolvedValue(mockPosts),
          } as any as SelectQueryBuilder<PostEntity>),
      );

      const posts = await postService.findFilteredPosts({
        from: 5,
        count: 10,
      });

      expect(posts).toEqual(mockPosts);
    });
  });

  describe('findAllPostComments', () => {
    it('should throw an exception if postId is empty', async () => {
      await expect(async () => await postService.findAllPostComments(null)).rejects.toThrow('PostId is empty');
    });

    it('should throw an exception if post does not exist', async () => {
      mockPostRepository.findOne = fn().mockResolvedValue(null);

      await expect(async () => await postService.findAllPostComments(1)).rejects.toThrow('A post with the specified id does not exist');
    });

    it('should return comments from repository', async () => {
      const testComments = [{ id: 1, content: 'This is comment 1' } as CommentEntity];
      mockPostRepository.findOne = fn().mockResolvedValue(mockPosts.at(0));
      mockCommentRepository.find = fn().mockResolvedValue(testComments);

      const result = await postService.findAllPostComments(0);

      expect(result).toEqual(testComments);
    });
  });

  describe('findPostById', () => {
    it('should throw an exception if postId is empty', async () => {
      await expect(async () => await postService.findPostById(null)).rejects.toThrow('PostId is empty');
    });

    it('should throw an exception if post does not exist', async () => {
      mockPostRepository.findOne = fn().mockResolvedValue(null);

      await expect(async () => await postService.findPostById(1)).rejects.toThrow("Post doesn't exist");
    });

    it('should return post from repository result', async () => {
      const post = mockPosts.at(0);
      mockPostRepository.findOne = fn().mockResolvedValue(post);

      const result = await postService.findPostById(0);

      expect(result).toEqual(post);
    });
  });

  describe('createPost', () => {
    it('should throw an exception if postData is empty', async () => {
      await expect(async () => await postService.createPost(null, 1)).rejects.toThrow('postData is empty');
    });

    it('should throw an exception if authorId is null', async () => {
      await expect(
        async () =>
          await postService.createPost(
            {
              title: 'test',
              content: 'test',
            },
            null,
          ),
      ).rejects.toThrow('authorId is empty');
    });

    it('should create a post and return value from repository', async () => {
      const post = mockPosts.at(0);
      const user = { id: 1 } as UserEntity;
      mockUserRepostory.findOne = fn().mockResolvedValue(user);
      mockPostRepository.create = fn(
        () =>
          ({
            save: fn().mockResolvedValue(post),
          } as any),
      );

      const result = await postService.createPost(
        {
          title: 'test',
          content: 'test',
        },
        0,
      );

      expect(result).toEqual(post);
    });

    it('should throw an exception if user with the author id does not exist', async () => {
      mockUserRepostory.findOne = fn().mockResolvedValue(null);

      await expect(
        async () =>
          await postService.createPost(
            {
              title: 'test',
              content: 'test',
            },
            0,
          ),
      ).rejects.toThrow('A user with the specified authorId does not exist');
    });
  });

  describe('updatePost', () => {
    it('should throw an exception if postData is empty', async () => {
      await expect(async () => await postService.updatePost(0, 1, null)).rejects.toThrow('postData is empty');
    });

    it('should throw an exception if postId is empty', async () => {
      await expect(
        async () =>
          await postService.updatePost(null, 1, {
            title: 'test',
            content: 'test',
          }),
      ).rejects.toThrow('postId is empty');
    });

    it('should throw an exception if callerId is empty', async () => {
      await expect(
        async () =>
          await postService.updatePost(0, null, {
            title: 'test',
            content: 'test',
          }),
      ).rejects.toThrow('callerId is empty');
    });

    it('should throw an exception if post does not exist', async () => {
      mockPostRepository.findOne = fn().mockResolvedValue(null);

      await expect(async () => await postService.findAllPostComments(1)).rejects.toThrow('A post with the specified id does not exist');
    });

    it('should update post and return the result from repository', async () => {
      const post = mockPosts.at(0);
      mockPostRepository.update = fn().mockResolvedValue(post);
      mockPostRepository.findOne = fn().mockResolvedValue(post);

      const result = await postService.updatePost(0, 1, {
        title: 'test',
        content: 'test',
      });

      expect(result).toEqual(post);
    });
  });

  describe('deletePost', () => {
    it('should throw an exception if postData is empty', async () => {
      await expect(async () => await postService.deletePost(0, null)).rejects.toThrow('callerId is empty');
    });

    it('should throw an exception if postId is empty', async () => {
      await expect(async () => await postService.deletePost(null, 1)).rejects.toThrow('postId is empty');
    });

    it('should throw an exception if post does not exist', async () => {
      mockPostRepository.findOne = fn().mockResolvedValue(null);

      await expect(async () => await postService.deletePost(1, 2)).rejects.toThrow("Post doesn't exist");
    });

    it('should delete post and return value of post that was deleted', async () => {
      const post = mockPosts.at(0);
      mockPostRepository.findOne = fn().mockResolvedValue(post);
      mockPostRepository.delete = fn().mockResolvedValue(post);

      const result = await postService.deletePost(0, 1);

      expect(result).toEqual(post);
    });
  });
});
