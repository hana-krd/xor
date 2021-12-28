import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './AuthGuards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
       private authService: AuthService
    ) { }


    @Post('/signin')
    @UseGuards(LocalAuthGuard)
    signIn(@Request() req) {
        return this.authService.login(req.user);
    }
}
