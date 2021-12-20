import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    var found = await this.userModel.findOne({ mobile: createUserDto.mobile })
    .populate('nantionality');

    if (found) {
      throw new ConflictException(
        `User ${createUserDto.mobile} already exists`,
      );
    }

    found = await this.userModel.findOne({
      nationalCode: createUserDto.nationalCode,
    });

    if (found) {
      throw new ConflictException(
        `User ${createUserDto.nationalCode} already exists`,
      );
    }
    return this.userModel.create(createUserDto);
  }
}
