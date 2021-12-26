import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CountryModule } from './country/country.module';
import { FileModule } from './file/file.module';
import { CharitiesModule } from './charities/charities.module';

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
    CharitiesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
