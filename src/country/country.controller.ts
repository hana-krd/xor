import { Controller, Get, Res } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {

    constructor(
        private countryService: CountryService
    ){}

    @Get()
    async getAllCountries(@Res() res){
        const countries =  await this.countryService.Coutries();

        return res.status(200).json({
            countries :  countries
        })
    }
}
