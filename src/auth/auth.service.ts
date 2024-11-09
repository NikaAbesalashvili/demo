import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserSignInDto } from 'src/users/dto/user-sign-in.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {};

    async signIn(userSignInDto: UserSignInDto): Promise<{ token: string; user: { id, name, email, createdAt, updatedAt, } }> {
        const user = await this.userService.signInUser(userSignInDto);
        const { id, name, email, createdAt, updatedAt } = user;
        const payload = { username: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id,
                name,
                email,
                createdAt,
                updatedAt,
            }
        };
    };
};
