import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { UserRolesGuard } from '../auth/Guards/user-role.guard';
import { UserVerifiedGuard } from '../auth/Guards/user-verified.guard';
import { UserRoles } from '../auth/user-role.decorator';
import { User } from '../database/schemas/user.schema';
import { Roles } from '../static/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, UserVerifiedGuard, UserRolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
  @UserRoles(Roles.CHARITY_CREATOR, Roles.ACCOUNTANT)
  async searchUsers(@Body() filters: UserFilterDto, @Res() res) {
    return res.status(200).json({
      users: await this.userService.search(filters),
    });
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateUserInformation(
    @Body() userDto: CreateUserDto,
    @Param('id') userId: string,
    @Res() res,
  ) {
    const result = await this.userService.updateUser(userId, userDto);
    return res.status(200).json({
      message: result ? 'updated successfully' : 'nothing happened',
    });
  }

  @Patch(':id/avatar')
  async updateUserAvatar(
    @Param('id') userId: string,
    @Body('fileId') fileId: string,
    @Res() res,
  ) {
    const result = await this.userService.updateUserAvatar(userId, fileId);

    return res.status(200).json({
      message:
        result.modifiedCount | result.matchedCount
          ? 'updated successfully'
          : 'nothing happened',
    });
  }
}
