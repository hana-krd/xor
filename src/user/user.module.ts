import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/user.schema';
import { Country, CountrySchema } from '../database/schemas/country.schema';
import { CurrencySchema, Currency } from '../database/schemas/currency.schema';
import { UserRole, UserRoleSchema } from '../database/schemas/user-role.schema';
import { UserRolesModule } from '../user-roles/user-roles.module';

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
      },
      {
        name: UserRole.name, schema: UserRoleSchema
      }
    ]),
    UserRolesModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
