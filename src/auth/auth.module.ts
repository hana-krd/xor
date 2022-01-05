import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './Guards/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Guards/strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { jwtOptions } from '../config/jwt.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register(jwtOptions),
    MailModule
  ],
  controllers:[AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports:[AuthService]
})
export class AuthModule { }
