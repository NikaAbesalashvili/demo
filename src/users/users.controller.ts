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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {};

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    };

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    };

    @Get('email')
    async findByEmail(@Query('email') email: string): Promise<User> {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    }

    @Post()
    create(@Body() userData: Partial<User>): Promise<User> {
        return this.usersService.create(userData);
    };

    @Patch(':id')
    update(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User> {
        return this.usersService.update(id, userData);
    };

    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.usersService.delete(id);
    };
};
