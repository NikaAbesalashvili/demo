import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findAll(): Promise<UserResponseDto[]> {
        return this.userRepository.find();
    };

    async findOne(id: string): Promise<UserResponseDto | undefined> {
        return this.userRepository.findOneBy({ id });
    };

    async findByEmail(email: string): Promise<UserResponseDto | undefined> {
        return this.userRepository.findOneBy({ email });
    };

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, ...rest } = createUserDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = {
            ...rest,
            password: hashedPassword,
        };
        return this.userRepository.save(newUser);
    };

    async signInUser(userSignInDto: UserSignInDto): Promise<User> {
        const user = await this.userRepository.findOneBy({ email: userSignInDto.email });
        
        if (!user) {
            throw new UnauthorizedException('Invalid E-mail');
        };

        const isPasswordValid = await bcrypt.compare(userSignInDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Password');
        };

        return user;
    };

    async update(id: string, updateData: UpdateUserDto): Promise<UserResponseDto> {
        await this.userRepository.update(id, updateData);
        return this.findOne(id);
    };

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    };
};
