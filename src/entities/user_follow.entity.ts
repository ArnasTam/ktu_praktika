import { UserEntity } from '@entities/users.entity';
import { UserFollow } from '@interfaces/user_follow.interface';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserFollowEntity extends BaseEntity implements UserFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(_ => UserEntity)
  @JoinColumn()
  followedUser: User;

  @ManyToOne(_ => UserEntity)
  @JoinColumn()
  follower: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
