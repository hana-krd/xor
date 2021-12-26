import {
    Body,
    Controller,
    Delete,
    Post,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { User } from '../database/schemas/user.schema';
import { Roles } from '../static/enum/role.enum';
import { GetUser } from '../user/user-decorator';
import { CharitiesService } from './charities.service';
import { createCharityDto } from './dto/create-charity.dto';

@Controller('charities')
export class CharitiesController {
    constructor(
        private charityService: CharitiesService,
    ) { }

    @Post('')
    @UsePipes(ValidationPipe)
    async createCharity(
        @Body() createCharity: createCharityDto,
        @GetUser() user: User,
    ) {
        return this.charityService.createCharity(
            createCharity,
            user,
        );
    }

    @Post('/manager')
    async addCharityManager(
        @Body('charityId') charity: string,
        @Body('roles') roles: Roles[],
        @GetUser() user: User,
    ) {
        return this.charityService.addManager(
            charity,
            roles,
            user
        );
    }

    @Delete('/manager')
    async removeCharityManager(
        @Body('charityId') charity: string,
        @Body('userRoleId') userRoleId: string,
        @Res() res
    ) {
        const result = await this.charityService.deleteManager(charity ,userRoleId);
        return res.status(200)
            .json({
                message:
                    (result.modifiedCount | result.matchedCount) ?
                        'updated successfully' : 'nothing happened'
            });
    }

}
