import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, _FilterQuery } from 'mongoose';
import { UserRoleDto } from './dto/create-user-role.dto';
import { UserRole, UserRoleDocument } from '../database/schemas/user-role.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { OrganType } from '../static/enum/organ-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { Roles } from '../static/enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const found = await this.userModel
      .findOne({
        $and: [
          { nationality: createUserDto.nationality },
          { nationalCode: createUserDto.nationalCode },
        ],
      })
      .populate('nationality')
      .populate('avatar')
      .exec();

    if (found) {
      throw new ConflictException(
        `User National Code ${createUserDto.nationalCode} already exists`,
      );
    }

    //TODO manage roles in user creation and update
    return this.userModel.create(createUserDto);
  }

  async findUserById(userId): Promise<User> {

    const found = await this.userModel
      .findOne({ _id: userId })
      .populate('nationality')
      .populate('avatar')
      .exec();

    if (!found) {
      throw new NotFoundException(`User not found`);
    }

    return found;
  }

  async search(filters?: UserFilterDto): Promise<User[]> {

    const found = await this.userModel.find({
      $and: [
        filters.name ? { 'name': { $regex: filters.name, $options: 'i' } } : {},
        filters.family ? { 'family': { $regex: filters.family, $options: 'i' } } : {},
        filters.mobile ? { 'mobile': { $regex: filters.mobile, $options: 'i' } } : {},
        filters.middleName ? { 'middleName': { $regex: filters.middleName, $options: 'i' } } : {},
        filters.nationality ? { 'nationality': { $regex: filters.nationality, $options: 'i' } } : {},
        filters.nationalCode ? { 'nationalCode': { $regex: filters.nationalCode, $options: 'i' } } : {},
        filters.income_greater_than ? { 'income': { $gte: filters.income_greater_than, $exists: true, $ne: null } } : {},
        filters.income_lower_than ? { 'income': { $lte: filters.income_lower_than, $exists: true, $ne: null } } : {},
      ]
    })
      .populate('nationality')
      .populate('avatar')
      .exec();

    return found;
  }

  async updateUser(userId: string, userDto: CreateUserDto): Promise<any> {
    await this.findUserById(userId);
    const result = await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          name: userDto.name,
          family: userDto.family,
          middleName: userDto.middleName,
          mobile: userDto.mobile,
          nationality: userDto.nationality,
          nationalCode: userDto.nationalCode,
          income: userDto.income,
        }
      },
    ).exec();

    return result;
  }

  async updateUserAvatar(userId: string, fileId: string) {
    await this.findUserById(userId);
    const result = await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          avatar: fileId,
        }
      },
    ).exec();

    return result;
  }

  async addRole(userRoleDto: UserRoleDto): Promise<UserRole> {

    const userRole = await this.userRoleModel.findOne({
      $and: [
        { user: userRoleDto.user },
        { organ: userRoleDto.organ },
      ]
    }).populate('roles')
      .exec();

    if (userRole) {
      const newRoles: Roles[] = userRoleDto.roles.filter((role) => {
        if (userRole.roles.indexOf(role) === -1) {
          return role;
        }
      });

      newRoles.forEach(role => {
        userRole.roles.push(role);
      });

      userRole.save();


    } else {
      return this.userRoleModel.create(userRoleDto);
    }
  }

  async deleteRole(userRoleId: string) {
    return this.userRoleModel.remove({_id: userRoleId}).exec()
  }

}
