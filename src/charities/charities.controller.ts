import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { UserRolesGuard } from '../auth/Guards/user-role.guard';
import { UserVerifiedGuard } from '../auth/Guards/user-verified.guard';
import { User } from '../database/schemas/user.schema';
import { CreateFamilyDto } from '../families/dto/create-family.dto';
import { FamilyFilterDto } from '../families/dto/family-filter.dto';
import { Roles } from '../static/enum/role.enum';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserFilterDto } from '../user/dto/user-filter.dto';
import { GetUser } from '../user/user-decorator';
import { CharitiesService } from './charities.service';
import { createCharityDto } from './dto/create-charity.dto';

@UseGuards(JwtAuthGuard, UserVerifiedGuard, UserRolesGuard)
@Controller('charities')
export class CharitiesController {
  constructor(private charityService: CharitiesService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createCharity(
    @Body() createCharity: createCharityDto,
    @GetUser() user: User,
  ) {
    return this.charityService.createCharity(createCharity, user);
  }

  @Post(':charityId/manager')
  async addCharityManager(
    @Param('charityId') charityId: string,
    @Body('userId') user: string,
    @Body('roles') roles: Roles[],
    @Res() res,
  ) {
    await this.charityService.addManager(charityId, roles, user);
    return res.status(200).json({
      message: 'updated successfully',
    });
  }

  @Post(':charityId/member')
  @UsePipes(ValidationPipe)
  async addCharityMember(
    @Param('charityId') charityId: string,
    @Body() createUser: CreateUserDto,
    @Res() res,
  ) {
    await this.charityService.addMember(charityId, createUser);
    return res.status(200).json({
      message: 'User Added Successfully',
    });
  }

  @Get(':charityId/member')
  async searchMembers(
    @Body() filters: UserFilterDto,
    @Param('charityId') charityId: string,
    @Res() res,
  ) {
    return res.status(200).json({
      users: await this.charityService.searchMembers(charityId, filters),
    });
  }

  @Put(':charityId/member/:userId')
  @UsePipes(ValidationPipe)
  async updateMember(
    @Param('charityId') charityId: string,
    @Param('userId') userId: string,
    @Body() userDto: CreateUserDto,
    @Res() res,
  ) {
    const result = await this.charityService.updateMember(
      charityId,
      userId,
      userDto,
    );
    return res.status(200).json({
      message: result ? 'updated successfully' : 'nothing happened',
    });
  }

  @Get(':charityId/member/:userId')
  async getMember(
    @Param('charityId') charityId: string,
    @Param('userId') userId: string,
  ) {
    return await this.charityService.getMember(charityId, userId);
  }

  @Delete(':charityId/manager')
  async removeCharityManager(
    @Param('charityId') charityId: string,
    @Body('userId') userId: string,
    @Res() res,
  ) {
    const result = await this.charityService.deleteManager(charityId, userId);
    return res.status(200).json({
      message: result.deletedCount
        ? 'deleted successfully'
        : 'nothing happened',
    });
  }

  @Delete(':charityId/manager/role')
  async removeCharityManagerRole(
    @Param('charityId') charityId: string,
    @Body('role') role: Roles,
    @Body('userId') userId: string,
  ) {
    return this.charityService.deleteManagerRole(charityId, userId, role);
  }

  @Post(':charityId/families')
  createFamily(
    @Body() familyDto: CreateFamilyDto,
    @GetUser() admin: User,
    @Param('charityId') charityId: string,
  ) {
    return this.charityService.createFamily(charityId, familyDto, admin);
  }

  @Get(':charityId/families')
  @UsePipes(ValidationPipe)
  searchFamilies(
    @Param('charityId') charityId: string,
    @Body() filter: FamilyFilterDto,
  ) {
    return this.charityService.getFamilies(charityId, filter);
  }

  @Get(':charityId/families/:familyId')
  getFamily(
    @Param('familyId') familyId: string,
    @Param('charityId') charityId: string,
  ) {
    return this.charityService.getFamily(charityId, familyId);
  }
}
