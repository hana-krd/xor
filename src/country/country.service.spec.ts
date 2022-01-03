/* import { Model } from "mongoose";
import { async } from "rxjs";
import { Country, CountryDocument } from "../database/schemas/country.schema";

const mockCurrency = {
    iso: 'IRT'
}

const mockCountry: Country[] = [
    {name: 'Iran', language: 'fa', currency: {iso: 'IRT'}},
    {name: 'Iraq', language: 'ar', currency: {iso: 'IQD'}},
]

describe('countryService', ()=>{

    let countryModel: Model<CountryDocument>;

    beforeEach(()=>{
        countryModel = new Model();
        countryModel.find = jest.fn().mockResolvedValue(mockCountry);
        countryModel.populate = jest.fn().mockResolvedValue(mockCurrency);
    
    });

    it('getAllCountries', async ()=>{
        expect(countryModel.find).not.toBeCalled();
        const result = countryModel.find({_id: '123456789'}).populate('currency');
        expect(result).toEqual(mockCountry);
        expect(countryModel.populate).toBeCalled();
    })

}); */