import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './typeorm';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants';

export const commonModules = [
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d' },
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    load: [typeorm],
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) =>
      configService.get('typeorm'),
  }),
];
