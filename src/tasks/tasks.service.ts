import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TaskRepository) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}

// async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
//   return this.taskRepository.createTask(createTaskDto);
// }
// async deleteTask(id: number) {
//   const result = await this.taskRepository.delete(id);
//   if (result.affected === 0) {
//     throw new NotFoundException(`Task with ID "${id}" not found`);
//   }
// }
// async updateTaskStatus(id: number, status: TaskStatus) {
//   const task = await this.getTaskById(id);
//   task.status = status;
//   await task.save();
//   return task;
// }
