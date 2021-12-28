import { Injectable } from '@nestjs/common';
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
}
