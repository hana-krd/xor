import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { MailService } from '../mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateByUsernameAndPassword(
    username: string,
    pass: string,
  ): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);

    if (user) {
      const hashedPassword = await bcrypt.hash(pass, user.salt);

      if (user.password === hashedPassword) {
        return user;
      }
    }

    return null;
  }

  async validateByUserId(userId: string): Promise<any> {
    return this.usersService.findUserById(userId);
  }

  async signIn(user: User) {
    const payload = { userId: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async signUp(signupDto: SignUpDto) {
    signupDto.salt = await bcrypt.genSalt();

    signupDto.password = await bcrypt.hash(signupDto.password, signupDto.salt);

    const user = await this.usersService.createUserWithCredential(signupDto);

    const otp = (await this.usersService.newOtp(user)).toString();
    const mailResult = await this.mailService.sendOtp(otp, user.email);

    return this.signIn(user);
  }

  async verifyEmail(user: User, otp: VerifyOtpDto): Promise<boolean> {
    if (user && user.extraInfo && user.extraInfo.isEmailVerified) {
      throw new BadRequestException('Email Already Verified');
    }
    const validationResult = await this.usersService.validateOtp(user, otp);
    await this.usersService.emailVerified(user);
    return validationResult;
  }

  async requestOtp(user: User): Promise<boolean> {
    if (user && user.extraInfo && user.extraInfo.isEmailVerified) {
      throw new BadRequestException('User Already verified');
    }

    const otp = (await this.usersService.newOtp(user)).toString();
    const mailResult = await this.mailService.sendOtp(otp, user.email);

    return true;
  }
}
