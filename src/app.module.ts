import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CountryModule } from './country/country.module';

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
    CountryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
