/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      //we use "and where", when we want that thay work together
      //if only use "where" we overwrite any other where
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      //LIKE is very equal to = sign but it is allowing a partial match like %${IN SEQUELIZE}%
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const task = await query.getMany();
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create tasks for user "${user.username}", Data: ${createTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }
}
