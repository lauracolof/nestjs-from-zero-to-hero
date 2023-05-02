import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }
}

// @Delete('/:id')
// deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
//   return this.tasksService.deleteTask(id);
// }

// @Patch('/:id/status')
// updateTaskStatus(
//   @Param('id', ParseIntPipe) id: number,
//   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
// ): Promise<Task> {
//   return this.tasksService.updateTaskStatus(id, status);
// }
