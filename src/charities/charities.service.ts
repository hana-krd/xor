import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Charity, CharityDocument } from '../database/schemas/charity.schema';
import { UserRole } from '../database/schemas/user-role.schema';
import { User } from '../database/schemas/user.schema';
import { OrganType } from '../static/enum/organ-type.enum';
import { Roles } from '../static/enum/role.enum';
import { UserRolesService } from '../user-roles/user-roles.service';
import { UserRoleDto } from '../user/dto/create-user-role.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserFilterDto } from '../user/dto/user-filter.dto';
import { UserService } from '../user/user.service';
import { createCharityDto } from './dto/create-charity.dto';

@Injectable()
export class CharitiesService {
  constructor(
    @InjectModel(Charity.name) private charityModel: Model<CharityDocument>,
    private userService: UserService,
    private userRolesService: UserRolesService,
  ) {}

  async getCharityById(charityId: string): Promise<CharityDocument> {
    const found = await this.charityModel.findOne({ _id: charityId });

    if (!found) {
      throw new NotFoundException(`Charity Not found`);
    }

    return found;
  }

  async createCharity(
    charityDto: createCharityDto,
    user: User,
  ): Promise<Charity> {
    charityDto.owner = user._id.toString();
    const charity = await this.charityModel.create(charityDto);

    const defaultAdmin = await this.addDefaultAdmin(charity, user);
    charity.admins.push(defaultAdmin);
    charity.save();

    return charity;
  }

  private async addDefaultAdmin(
    charity: Charity,
    user: User,
  ): Promise<UserRole> {
    const userRoleDto: UserRoleDto = {
      user: user._id.toString(),
      organ: charity._id.toString(),
      organType: OrganType.CHARITY,
      roles: [Roles.CHARITY_CREATOR],
    };

    return await this.userRolesService.addRole(userRoleDto);
  }

  async addManager(
    charityId: string,
    roles: Roles[],
    user: string,
  ): Promise<UserRole> {
    const userRoleDto: UserRoleDto = {
      user: user,
      organ: charityId,
      organType: OrganType.CHARITY,
      roles: roles,
    };

    const charity = await this.getCharityById(charityId);
    const userRole = await this.userRolesService.addRole(userRoleDto);

    if (charity.admins.indexOf(userRole._id) === -1) {
      charity.admins.push(user);
      charity.save();
    }

    return userRole;
  }

  async deleteManager(charityId: string, userId: string) {
    const charity = await this.getCharityById(charityId);
    const deleteResult = this.userRolesService.deleteAllRoles(charityId, userId);

    charity.admins = charity.admins.filter(
      (admin) => admin._id.toString() !== userId,
    );
    charity.save();

    return deleteResult;
  }

  async deleteManagerRole(charityId: string, userId: string, role: Roles) {
    return this.userRolesService.deleteSomeRoles(charityId, userId, role);
  }

  async isUserMemberOfCharity(
    charityId: string,
    userId: string,
  ): Promise<boolean> {
    const charity = await this.getCharityById(charityId);
    const members: String[] = charity.members;

    //compare users are not same
    if (members && members.indexOf(userId) >= 0) {
      return true;
    }
    return false;
  }

  async addMember(charityId: string, userDto: CreateUserDto): Promise<boolean> {
    var user = await this.userService
      .findUserByNationality(userDto.nationality, userDto.nationalCode)
      .catch((err) => {
        return null;
      });

    if (!user) {
      user = await this.userService.createUser(userDto);
    }

    if (await this.isUserMemberOfCharity(charityId, user._id.toString())) {
      throw new BadRequestException('User Already in charity');
    }

    const charity = await this.getCharityById(charityId);
    charity.members.push(user._id);
    await charity.save();

    return true;
  }

  async searchMembers(charityId:string, filters: UserFilterDto): Promise<User[]> {
    const charity = await this.getCharityById(charityId);

    filters.usersIn = charity.members;

    return await this.userService.search(filters);
  }

  async updateMember(charityId:string, userId: string, userDto: CreateUserDto): Promise<boolean> {
    if (!(await this.isUserMemberOfCharity(charityId, userId))) {
      throw new NotFoundException('User is not in your charity');
    }
    return  await this.userService.updateUser(userId, userDto);
  }
}
