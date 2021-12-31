import { Module } from '@nestjs/common';
import { CharitiesService } from './charities.service';
import { CharitiesController } from './charities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Charity, CharitySchema } from '../database/schemas/charity.schema';
import { UserModule } from '../user/user.module';
import { UserRolesModule } from '../user-roles/user-roles.module';

@Module({
  imports: [
    UserModule,
    UserRolesModule,
    MongooseModule.forFeature([
      { name: Charity.name, schema: CharitySchema},
    ]),
  ],
  providers: [CharitiesService],
  controllers: [CharitiesController]
})
export class CharitiesModule {}
