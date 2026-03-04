import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export function JwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.getOrThrow('JWT_SECRET'),
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false
    },
    signOptions: {
      algorithm: 'HS256'
    }
  }
}