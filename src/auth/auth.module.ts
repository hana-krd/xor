import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './AuthGuards/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt-strategy.config';
import { JwtStrategy } from './AuthGuards/strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register(jwtConfig),
    MailModule
  ],
  controllers:[AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule { }
