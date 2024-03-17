import { Module } from '@nestjs/common';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';

import { AuthService } from './../../auth/auth.service';
import { RoomsService } from './../rooms.service';

@Module({
  providers: [DetailService, AuthService, RoomsService],
  controllers: [DetailController],
})
export class DetailModule {}
