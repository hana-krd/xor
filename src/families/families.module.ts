import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from '../database/schemas/family.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {name: Family.name, schema: FamilySchema}
    ])
  ],
  providers: [FamiliesService],
  controllers: [FamiliesController]
})
export class FamiliesModule {}
