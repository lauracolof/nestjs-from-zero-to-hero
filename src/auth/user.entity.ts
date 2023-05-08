/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
//check that username column it be unique
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  task: Task[];
  //custom method to validate the password
}
