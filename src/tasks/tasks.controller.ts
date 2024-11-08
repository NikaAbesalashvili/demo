// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('userId') userId: string,
  ): Promise<Task> {
    return this.tasksService.createTask(title, description, userId);
  };

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'in_progress' | 'done',
  ): Promise<Task> {
    const task = await this.tasksService.updateTask(id, status);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }
}
