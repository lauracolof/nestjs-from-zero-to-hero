/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
