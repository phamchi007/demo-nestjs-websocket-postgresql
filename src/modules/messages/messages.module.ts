import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

import { AuthService } from './../auth/auth.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, AuthService],
})
export class MessagesModule {}
