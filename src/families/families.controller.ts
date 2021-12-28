import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '../database/schemas/user.schema';
import { GetUser } from '../user/user-decorator';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamilyFilterDto } from './dto/family-filter.dto';
import { FamiliesService } from './families.service';

@Controller('families')
export class FamiliesController {
    constructor(
        private familyService: FamiliesService
    ) { }

    @Post('')
    createFamily(
        @Body() familyDto: CreateFamilyDto,
        @GetUser() admin: User,
    ) {
        return this.familyService.createFamily(familyDto, admin)
    }

    @Get()
    @UsePipes(ValidationPipe)
    getAllFamilies(@Body() filter: FamilyFilterDto) {
        return this.familyService.getAllFamilies(filter);
    }

    @Get(':id')
    getFamily(@Param('id') familyId: string) {
        return this.familyService.getFamilyById(familyId);
    }
}
