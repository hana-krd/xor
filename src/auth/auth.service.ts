import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async validateByUsernameAndPassword(username: string, pass: string): Promise<any> {
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
        };
    }

    async signUp(signupDto: SignUpDto) {
        signupDto.salt = await bcrypt.genSalt();
        signupDto.password = await bcrypt.hash(signupDto.password, signupDto.salt);
        return this.usersService.createUserWithCredential(signupDto);
    }
}
