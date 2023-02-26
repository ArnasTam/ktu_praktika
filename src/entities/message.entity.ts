import { UserEntity } from '@entities/users.entity';
import { Message } from '@interfaces/message.interface';
import { User } from '@interfaces/users.interface';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MessageEntity extends BaseEntity implements Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(_ => UserEntity)
  @JoinColumn()
  from: User;

  @ManyToOne(_ => UserEntity)
  @JoinColumn()
  to: User;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
