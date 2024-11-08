import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    };

    findOne(id: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ id });
    };

    findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ email });
    };

    create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    };

    async update(id: string, updateData: Partial<User>): Promise<User> {
        await this.userRepository.update(id, updateData);
        return this.findOne(id);
    };

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    };
};
