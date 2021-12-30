import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, _FilterQuery } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { SignUpDto } from '../auth/dto/signup.dto';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUserWithoutCredential(
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const found = await this.userModel.findOne({
      $and: [
        { nationality: createUserDto.nationality },
        { nationalCode: createUserDto.nationalCode },
      ],
    });

    if (found) {
      throw new ConflictException(
        `User National Code ${createUserDto.nationalCode} already exists`,
      );
    }
    return this.userModel.create(createUserDto);
  }

  async createUserWithCredential(signupDto: SignUpDto): Promise<UserDocument> {
    const found = await this.userModel.findOne({ email: signupDto.email });

    if (found) {
      throw new ConflictException(`Email ${signupDto.email} already exists`);
    }
    return this.userModel.create(signupDto);
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

  async findUserByUsername(username): Promise<User> {
    const found = await this.userModel
      .findOne({
        $or: [{ mobile: username }, { email: username }],
      })
      .populate('nationality')
      .populate('avatar')
      .exec();

    if (!found) {
      throw new NotFoundException(`User not found`);
    }

    return found;
  }

  async search(filters?: UserFilterDto): Promise<User[]> {
    const found = await this.userModel
      .find({
        $and: [
          filters.name ? { name: { $regex: filters.name, $options: 'i' } } : {},
          filters.family
            ? { family: { $regex: filters.family, $options: 'i' } }
            : {},
          filters.mobile
            ? { mobile: { $regex: filters.mobile, $options: 'i' } }
            : {},
          filters.middleName
            ? { middleName: { $regex: filters.middleName, $options: 'i' } }
            : {},
          filters.nationality
            ? { nationality: { $regex: filters.nationality, $options: 'i' } }
            : {},
          filters.nationalCode
            ? { nationalCode: { $regex: filters.nationalCode, $options: 'i' } }
            : {},
          filters.income_greater_than
            ? {
                income: {
                  $gte: filters.income_greater_than,
                  $exists: true,
                  $ne: null,
                },
              }
            : {},
          filters.income_lower_than
            ? {
                income: {
                  $lte: filters.income_lower_than,
                  $exists: true,
                  $ne: null,
                },
              }
            : {},
        ],
      })
      .populate('nationality')
      .populate('avatar')
      .exec();

    return found;
  }

  async updateUser(userId: string, userDto: CreateUserDto): Promise<any> {
    await this.findUserById(userId);
    const result = await this.userModel
      .updateOne(
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
          },
        },
      )
      .exec();

    return result;
  }

  async updateUserAvatar(userId: string, fileId: string) {
    await this.findUserById(userId);
    const result = await this.userModel
      .updateOne(
        { _id: userId },
        {
          $set: {
            avatar: fileId,
          },
        },
      )
      .exec();

    return result;
  }

  async newOtp(user: User): Promise<string> {
    const otp = randomInt(111111, 999999).toString();
    const hashed = await bcrypt.hash(otp, user.salt);

    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 15);

    if (!user.extraInfo) {
      user.extraInfo = {};
    }

    //TODO change otp for different platform and different ips
    //mobile otp, email otp, from web, from android, from ios,
    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          'extraInfo.otp': hashed,
          'extraInfo.otpExpiresAt': expireDate,
        },
      },
    );

    return otp;
  }

  async validateOtp(user: User, otp: VerifyOtpDto): Promise<boolean> {
    const hashed = await bcrypt.hash(otp.otp, user.salt);
    const currentTime = new Date();

    if (
      hashed !== user.extraInfo.otp ||
      currentTime > user.extraInfo.otpExpiresAt
    ) {
      throw new BadRequestException('OTP is wrong OR Expired');
    }

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          'extraInfo.isEmailVerified': true,
          'extraInfo.otp': null,
          'extraInfo.otpExpiresAt': null,
        },
      },
    );

    return true;
  }

  async emailVerified(user: User): Promise<void> {
    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          'extraInfo.isEmailVerified': true,
        },
      },
    );
  }
}
