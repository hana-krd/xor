import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
    secret: 'secretKey',
    signOptions: {
        expiresIn: '8640000s'
    }
}