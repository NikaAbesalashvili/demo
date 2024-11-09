import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserSignInDto } from 'src/users/dto/user-sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {};

    async signIn(userSignInDto: UserSignInDto): Promise<{ token: string }> {
        const user = await this.userService.signInUser(userSignInDto);
        const payload = { username: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);
        return { token };
    };
};
