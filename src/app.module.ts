import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CountryModule } from './country/country.module';
import { FileModule } from './file/file.module';
import { CharitiesModule } from './charities/charities.module';
import { FamiliesModule } from './families/families.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { BullModule } from '@nestjs/bull';
import { AllHttpExceptionsFilter } from './common';
import { bullOption } from './config/bull.config';
import { mongoOption } from './config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongoOption.uri),
    BullModule.forRoot(bullOption),
    UserModule,
    CountryModule,
    FileModule,
    CharitiesModule,
    FamiliesModule,
    AuthModule,
    MailModule,
    UserRolesModule
  ],
  controllers: [],
  providers: [AllHttpExceptionsFilter],
})
export class AppModule {}
