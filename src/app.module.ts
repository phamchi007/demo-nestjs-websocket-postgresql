import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

import { ConnectionsModule } from './modules/connections/connections.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { MessagesModule } from './modules/messages/messages.module';

import { commonModules } from './config/common.module';

@Module({
  imports: [
    ...commonModules,
    EventsModule,
    AuthModule,
    UserModule,
    ConnectionsModule,
    RoomsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
