import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/users.entity';
import { Comment } from '@interfaces/comment.interface';
import { Post } from '@interfaces/post.interface';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class CommentEntity extends BaseEntity implements Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  content: string;

  @ManyToOne(_ => UserEntity)
  @JoinColumn()
  author: User;

  @ManyToOne(_ => PostEntity)
  @JoinColumn()
  post: Post;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
