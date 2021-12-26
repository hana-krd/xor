import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
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
    createUser(@Body() createUser: CreateUserDto): Promise<User> {
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

    @Put(':id')
    async updateUserInformation(
        @Param('id') userId: string, 
        @Param('filed') filed: string,
        @Body() userDto: CreateUserDto,
        @Res() res
        ){
            const result = await this.userService.updateUser(userId, userDto);
            return res.status(200)
            .json({
                message:
                 (result.modifiedCount | result.matchedCount)? 
                 'updated successfully': 'nothing happened'
            });
    }

    @Patch(':id/avatar')
    async updateUserAvatar(
        @Param('id') userId: string,
        @Body('fileId') fileId: string,
        @Res() res
    ) {
        const result = await this.userService.updateUserAvatar(userId, fileId);

        return res.status(200)
            .json({
                message:
                    (result.modifiedCount | result.matchedCount) ?
                        'updated successfully' : 'nothing happened'
            });
    }

}
