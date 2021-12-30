import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserRole,
  UserRoleDocument,
} from '../database/schemas/user-role.schema';
import { User } from '../database/schemas/user.schema';
import { OrganType } from '../static/enum/organ-type.enum';
import { Roles } from '../static/enum/role.enum';
import { UserRoleDto } from '../user/dto/create-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>,
  ) {}

  async addRole(userRoleDto: UserRoleDto): Promise<UserRole> {
    const userRole = await this.userRoleModel
      .findOne({
        $and: [{ user: userRoleDto.user }, { organ: userRoleDto.organ }],
      })
      .populate('roles')
      .exec();

    if (userRole) {
      const newRoles: Roles[] = userRoleDto.roles.filter((role) => {
        if (userRole.roles.indexOf(role) === -1) {
          return role;
        }
      });

      newRoles.forEach((role) => {
        userRole.roles.push(role);
      });

      return userRole.save();
    } else {
      return this.userRoleModel.create(userRoleDto);
    }
  }

  async deleteAllRoles(userRoleId: string) {
    return this.userRoleModel.deleteOne({ _id: userRoleId }).exec();
  }

  async deleteSomeRoles(userRoleId: string, role: Roles) {
    const userRole = await this.userRoleModel.findOne({ _id: userRoleId });

    if (!userRole) {
      throw new NotFoundException('this user is not in your charity');
    }

    userRole.roles = userRole.roles.filter((localRole) => localRole !== role);
    return userRole.save();
  }
    
    async getUserRoles(charityId: string, user: User): Promise<UserRole>{
        return this.userRoleModel.findOne({
            user: user._id,
            organ: charityId,
            organType: OrganType.CHARITY
        });
    }
}
