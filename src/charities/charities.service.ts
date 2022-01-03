import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Charity, CharityDocument } from '../database/schemas/charity.schema';
import { Family, FamilyDocument } from '../database/schemas/family.schema';
import { UserRole } from '../database/schemas/user-role.schema';
import { User } from '../database/schemas/user.schema';
import { CreateFamilyDto } from '../families/dto/create-family.dto';
import { FamilyFilterDto } from '../families/dto/family-filter.dto';
import { FamiliesService } from '../families/families.service';
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
    private familyService: FamiliesService,
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

    await this.addManager(
      charity._id,
      [Roles.CHARITY_CREATOR],
      user._id.toString(),
    );
    charity.admins.push(user._id);
    charity.save();

    return charity;
  }

  async addManager(
    charityId: string,
    roles: Roles[],
    userId: string,
  ): Promise<UserRole> {
    const userRoleDto: UserRoleDto = {
      user: userId,
      organ: charityId,
      organType: OrganType.CHARITY,
      roles: roles,
    };

    const charity = await this.getCharityById(charityId);
    const userRole = await this.userRolesService.addRole(userRoleDto);

    if (charity.admins.indexOf(userId) === -1) {
      charity.admins.push(userId);
      charity.save();
    }

    return userRole;
  }

  async deleteManager(charityId: string, userId: string) {
    const charity = await this.getCharityById(charityId);
    const deleteResult = this.userRolesService.deleteAllRoles(
      charityId,
      userId,
    );

    charity.admins = charity.admins.filter(
      (admin) => admin._id.toString() !== userId,
    );
    charity.save();

    return deleteResult;
  }

  async deleteManagerRole(charityId: string, userId: string, role: Roles) {
    return this.userRolesService.deleteSomeRoles(charityId, userId, role);
  }

  async isFamilyInCharity(
    charityId: string,
    familyId: string,
  ): Promise<boolean> {
    const charity = await this.getCharityById(charityId);
    const families: String[] = charity.families;

    if (families && families.indexOf(familyId) >= 0) {
      return true;
    }
    return false;
  }

  async isUserMemberOfFamily(
    charityId: string,
    familyId: string,
    userId: string,
  ): Promise<boolean> {
    const family = await this.getFamilyById(charityId, familyId);
    const members: String[] = family.members;

    if (members && members.indexOf(userId) >= 0) {
      return true;
    }
    return false;
  }

  async addMember(
    charityId: string,
    familyId: string,
    userDto: CreateUserDto,
  ): Promise<boolean> {
    var user = await this.userService
      .findUserByNationality(userDto.nationality, userDto.nationalCode)
      .catch((err) => {
        return null;
      });

    if (!user) {
      user = await this.userService.createUser(userDto);
    }

    if (!(await this.isFamilyInCharity(charityId, familyId))) {
      throw new NotFoundException('Family is not in your charity');
    }

    await this.familyService.addMember(familyId, user._id.toString());

    return true;
  }

  async searchMembers(
    charityId: string,
    filters: UserFilterDto,
  ): Promise<User[]> {
    const charity = await (
      await this.getCharityById(charityId)
    ).populate('families');

    if (!charity || !charity.families) {
      throw new NotFoundException('Search result empty');
    }
    filters.usersIn = [];

    charity.families.forEach((family) => {
      if (family.members) {
        filters.usersIn = filters.usersIn.concat(family.members);
      }
    });

    return await this.userService.search(filters);
  }

  async updateMember(
    charityId: string,
    familyId: string,
    userId: string,
    userDto: CreateUserDto,
  ): Promise<boolean> {
    if (!(await this.isUserMemberOfFamily(charityId, familyId, userId))) {
      throw new NotFoundException('User is not in your charity');
    }

    return await this.userService.updateUser(userId, userDto);
  }

  async getMember(
    charityId: string,
    familyId: string,
    userId: string,
  ): Promise<User> {
    if (!(await this.isUserMemberOfFamily(charityId, familyId, userId))) {
      throw new NotFoundException('User is not in your charity');
    }

    return await this.userService.findUserById(userId);
  }

  async createFamily(
    charityId: string,
    familyDto: CreateFamilyDto,
    admin: User,
  ): Promise<Family> {
    familyDto.charity = charityId;
    const family = await this.familyService.createFamily(familyDto, admin);
    const charity = await this.getCharityById(charityId);
    charity.families.push(family._id);
    await charity.save();
    return family;
  }

  async getFamilies(
    charityId: string,
    filters: FamilyFilterDto,
  ): Promise<Family[]> {
    const charity = await this.getCharityById(charityId);

    filters.familiesIn = charity.families;

    return await this.familyService.search(filters);
  }

  async getFamilyById(
    charityId: string,
    familyId: string,
  ): Promise<FamilyDocument> {
    if (!(await this.isFamilyInCharity(charityId, familyId))) {
      throw new NotFoundException('Family is not in your charity');
    }
    return await this.familyService.findFamilyById(familyId);
  }
}
