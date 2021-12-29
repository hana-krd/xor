import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './AuthGuards/local-auth.guard';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(
       private authService: AuthService
    ) { }


    @Post('/signin')
    @UseGuards(LocalAuthGuard)
    signInNormal(@Request() req) {
        return this.authService.signIn(req.user);
    }

    @Post('auth/signup')
    signUpNormal(signupDto: SignUpDto) {
        return this.authService.signUp(signupDto);
    }

    //TODO check other ways like fb, google to signin/signup
}
