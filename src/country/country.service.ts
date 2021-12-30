import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from '../database/schemas/country.schema';

@Injectable()
export class CountryService {

    constructor(
        @InjectModel(Country.name) private countryModel: Model<CountryDocument>
    ) { }

    async Countries(): Promise<Country[]> {
        return this.countryModel.find()
            .populate('currency');
    }
}
