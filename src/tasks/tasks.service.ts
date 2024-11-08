import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { v4 as uuid } from 'uuid';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<Task[]> {
        return this.tasksRepository.find({ relations: ['user'] });
    };

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`)
        }

        return task;
    };

    async createTask(title: string, description: string, userId: string): Promise<Task> {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const newTask = this.tasksRepository.create({
            title,
            description,
            user,
        });

        return this.tasksRepository.save(newTask);
    };

    async updateTask(id: string, status: 'pending' | 'in_progress' | 'done'): Promise<Task> {
        const task = await this.findOne(id);

        if (task) {
            const updatedTask = {
                ...task,
                status,
            };
            return this.tasksRepository.save(updatedTask);
        }
        throw new NotFoundException(`User with ID ${id} not found`);
    };

    async deleteTask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    };
};
