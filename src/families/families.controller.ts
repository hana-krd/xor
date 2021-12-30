import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { UserVerifiedGuard } from '../auth/Guards/user-verified.guard';
import { User } from '../database/schemas/user.schema';
import { GetUser } from '../user/user-decorator';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamilyFilterDto } from './dto/family-filter.dto';
import { FamiliesService } from './families.service';

@UseGuards(JwtAuthGuard, UserVerifiedGuard)
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
