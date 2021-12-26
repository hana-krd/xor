import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Charity, CharityDocument } from '../database/schemas/charity.schema';
import { UserRole } from '../database/schemas/user-role.schema';
import { User } from '../database/schemas/user.schema';
import { OrganType } from '../static/enum/organ-type.enum';
import { Roles } from '../static/enum/role.enum';
import { UserRoleDto } from '../user/dto/create-user-role.dto';
import { UserService } from '../user/user.service';
import { createCharityDto } from './dto/create-charity.dto';

@Injectable()
export class CharitiesService {
    constructor(
        @InjectModel(Charity.name) private charityModel: Model<CharityDocument>,
        private userService: UserService,
    ) { }

    async getCharityById(charityId: string): Promise<CharityDocument> {
        const found = await this.charityModel.findOne({ _id: charityId });

        if (!found) {
            throw new NotFoundException(`Charity Not found`);
        }

        return found;
    }

    async createCharity(charityDto: createCharityDto, user: User): Promise<Charity> {

        charityDto.owner = user._id.toString();
        const charity = await this.charityModel.create(charityDto);

        const defaultAdmin = await this.addDefaultAdmin(charity, user);
        charity.admins.push(defaultAdmin);
        charity.save();

        return charity;
    }


    private async addDefaultAdmin(charity: Charity, user: User): Promise<UserRole> {

        const userRoleDto: UserRoleDto = {
            user: user._id.toString(),
            organ: charity._id.toString(),
            organType: OrganType.CHARITY,
            roles: [Roles.CHARITY_CREATOR]
        }

        return await this.userService.addRole(userRoleDto);
    }

    async addManager(charityId: string, roles: Roles[], user: User): Promise<UserRole> {

        const userRoleDto: UserRoleDto = {
            user: user._id.toString(),
            organ: charityId,
            organType: OrganType.CHARITY,
            roles: roles
        }

        const charity = await this.getCharityById(charityId);
        const userRole = await this.userService.addRole(userRoleDto);

        charity.admins.push(userRole);
        charity.save();

        return userRole;
    }

    async deleteManager(charityId: string, userRoleId: string) {
        const charity = await this.getCharityById(charityId);
        const deleteResult = this.userService.deleteRole(userRoleId);

        charity.admins = charity.admins.filter(
            (admin) => admin._id.toString() !== userRoleId);
        charity.save();
        return deleteResult;
    }
}
