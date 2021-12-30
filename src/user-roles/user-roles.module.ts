import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { UserRole, UserRoleSchema } from '../database/schemas/user-role.schema';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: UserRole.name, schema: UserRoleSchema}
    ])
  ],
  providers: [UserRolesService],
  exports: [UserRolesService]
})
export class UserRolesModule {}
