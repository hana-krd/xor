import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { UserVerifiedGuard } from '../auth/Guards/user-verified.guard';
import { CountryService } from './country.service';

@UseGuards(JwtAuthGuard, UserVerifiedGuard)
@Controller('country')
export class CountryController {

    constructor(
        private countryService: CountryService
    ){}

    @Get()
    async getAllCountries(@Res() res){
        const countries =  await this.countryService.Countries();

        return res.status(200).json({
            countries :  countries
        })
    }
}
