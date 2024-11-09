import { Body, Post, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from 'src/users/dto/user-sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {};

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() userSignInDto: UserSignInDto): Promise<{ token: string }> {
        return this.authService.signIn(userSignInDto);
    };
};
