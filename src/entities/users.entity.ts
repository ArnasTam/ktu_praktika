import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, Column, Unique, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryColumn()
  @IsNotEmpty()
  id: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column({ nullable: true })
  about?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
