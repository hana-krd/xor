import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Family, FamilyDocument } from '../database/schemas/family.schema';
import { User } from '../database/schemas/user.schema';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamilyFilterDto } from './dto/family-filter.dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectModel(Family.name) private familyModel: Model<FamilyDocument>,
  ) {}

  async createFamily(familyDto: CreateFamilyDto, admin: User): Promise<Family> {
    familyDto.creator = admin._id.toString();
    return this.familyModel.create(familyDto);
  }

  async findFamilyById(familyId: string): Promise<FamilyDocument> {
    const found = await this.familyModel.findOne({ _id: familyId });

    if (!found) {
      throw new NotFoundException(`Family could not be found`);
    }

    return found;
  }

  async search(filters: FamilyFilterDto): Promise<Family[]> {
    return this.familyModel
      .find({
        $and: [
          filters.name ? { name: { $regex: filters.name, $options: 'i' } } : {},
          filters.charity ? { charity: { $eq: filters.charity } } : {},
          filters.head ? { head: { $eq: filters.head } } : {},
          filters.creator ? { creator: { $eq: filters.creator } } : {},
          filters.memberCount > 0
            ? { members: { $size: filters.memberCount } }
            : {},
          filters.familiesIn ? { _id: { $in: filters.familiesIn } } : {},
        ],
      })
      .exec();
  }

  async addMember(familyId: string, userId: string): Promise<boolean> {
    const family = await this.findFamilyById(familyId);

    if (family.members.indexOf(userId) >= 0) {
      throw new ConflictException('User already in this family');
    }

    family.members.push(userId);

    await this.familyModel.updateOne(
      { _id: familyId },
      {
        $set: {
          members: family.members,
        },
      },
    );

    return true;
  }
}
