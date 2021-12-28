import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByUsername(username);
        
        if (user && user.password === pass) {
            return user;
        }
        return null;
    }

    async login(user: User) {
        const payload = { userId: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
