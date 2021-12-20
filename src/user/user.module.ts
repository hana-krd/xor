import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/user.schema';
import { Country, CountrySchema } from '../database/schemas/country.schema';
import { CurrencySchema, Currency } from '../database/schemas/currency.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: User.name, schema: UserSchema
      },
      {
        name: Country.name, schema: CountrySchema
      },
      {
        name: Currency.name, schema: CurrencySchema
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
