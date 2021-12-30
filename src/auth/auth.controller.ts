import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../database/schemas/user.schema';
import { GetUser } from '../user/user-decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';
import { LocalAuthGuard } from './Guards/local-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  signInNormal(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUpNormal(@Body() signupDto: SignUpDto) {
    return this.authService.signUp(signupDto);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('/verify/email')
  async verifyEmail(
    @Body() otp: VerifyOtpDto,
    @GetUser() user: User,
    @Res() res,
  ) {
    const result = await this.authService.verifyEmail(user, otp);
    return res.status(200).json({
      message: result ? 'Email Verified' : 'Some Problems Occurred',
    });
  }

  @Post('/otp')
  @UseGuards(JwtAuthGuard)
  async requestOtp(@GetUser() user: User, @Res() res) {
    const result = await this.authService.requestOtp(user);
    return res.status(200).json({
      message: result ? 'OTP Send' : 'Some Problems Occurred',
    });
  }

  //TODO check other ways like fb, google to signin/signup
}
