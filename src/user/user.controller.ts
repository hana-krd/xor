import { Body, Controller, Get, Param, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    createtUser(@Body() createUser: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUser);
    }

    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return this.userService.findUserById(id);
    }

    @Get()
    async searchUsers(@Body() filters: UserFilterDto, @Res() res) {
        return res.status(200)
            .json({
                users: await this.userService.search(filters)
            });

    }


}
