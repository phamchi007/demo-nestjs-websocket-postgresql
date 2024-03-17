import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

import { AuthService } from './../auth/auth.service';
import { DetailModule } from './detail/detail.module';
import { DetailService as RoomDetailService } from './detail/detail.service';

import { MessagesService } from './../messages/messages.service';
@Module({
  controllers: [RoomsController],
  providers: [RoomsService, AuthService, RoomDetailService, MessagesService],
  imports: [DetailModule],
})
export class RoomsModule {}
