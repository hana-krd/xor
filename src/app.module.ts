import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CountryModule } from './country/country.module';
import { FileModule } from './file/file.module';
import { CharitiesModule } from './charities/charities.module';
import { FamiliesModule } from './families/families.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserRolesModule } from './user-roles/user-roles.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb://localhost:27017/xor",
      {
        auth:{
          username: "root",
          password: "123456789"
        }
      }
    ),
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
  providers: [],
})
export class AppModule {}
