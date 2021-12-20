import { Body, Controller, Get, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ){}

    @UsePipes(ValidationPipe)
    @Get('')
    async createTestUser(@Body() createUser: CreateUserDto): Promise<User>{
        const user = await this.userService.createUser(createUser);
        console.log(user);
        
        return user;
    }

}
