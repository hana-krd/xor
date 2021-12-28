import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Family, FamilyDocument } from '../database/schemas/family.schema';
import { User } from '../database/schemas/user.schema';
import { CreateFamilyDto } from './dto/create-family.dto';

@Injectable()
export class FamiliesService {
    constructor(
        @InjectModel(Family.name) private familyModel: Model<FamilyDocument>
    ) { }
    
    async createFamily(familyDto: CreateFamilyDto, admin: User): Promise<Family>{
        familyDto.creator = admin._id.toString();
        return this.familyModel.create(familyDto);
    }

    async getFamilyById(familyId: string): Promise<Family>{
        const found = this.familyModel.findOne({ _id: familyId });

        if (!found) {
            throw new NotFoundException(`Family could not be found`);
        }

        return found;
    }
}
