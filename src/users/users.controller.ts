import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
    NotFoundException,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {};

    @Get()
    findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    };

    @Get(':id')
    findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    };

    @Get('email')
    async findByEmail(@Query('email') email: string): Promise<UserResponseDto> {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const newUser = await this.usersService.create(createUserDto);
        return plainToInstance(UserResponseDto, newUser);
    };

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Request() request) {
        return request.user;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<UserResponseDto> {
        return this.usersService.update(id, userData);
    };

    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.usersService.delete(id);
    };
};
