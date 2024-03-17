import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

import { AuthService } from './../auth/auth.service';

import { ConnectionsService } from '../connections/connections.service';
import { MessagesService } from '../messages/messages.service';

@Module({
  providers: [EventsGateway, AuthService, ConnectionsService, MessagesService],
})
export class EventsModule {}
