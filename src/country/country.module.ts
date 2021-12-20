import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from '../database/schemas/country.schema';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Country.name, schema: CountrySchema
      }
    ])
  ],
  controllers: [CountryController],
  providers: [CountryService]
})
export class CountryModule {}
