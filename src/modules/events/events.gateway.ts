import { UseGuards } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { WSGuard } from '../../middleware/ws.guard';

import { AuthService } from '../auth/auth.service';
import { ConnectionsService } from '../connections/connections.service';
import { MessagesService } from '../messages/messages.service';

import { listenType, eventKey } from '../../common/constants';
import { connectionStatus } from '../../common/enum';

@WebSocketGateway()
export class EventsGateway {
  constructor(
    private authService: AuthService,
    private connectionsService: ConnectionsService,
    private messagesService: MessagesService,
  ) {}
  @WebSocketServer()
  server: Server;

  @UseGuards(WSGuard)
  @SubscribeMessage('event')
  async recieveEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const jwtPayload = await this.handleAccessToken(client);
    if (jwtPayload) {
      // Todo
    } else {
      client.disconnect();
    }
  }

  @UseGuards(WSGuard)
  @SubscribeMessage('message')
  async recieveMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // Hanlde message key
    const jwtPayload = await this.handleAccessToken(client);
    if (jwtPayload) {
      // Handle mesg
      await this.messagesService.receiveMsg(jwtPayload.user_id, data);
    } else {
      client.disconnect();
    }
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    // Verify token
    const jwtPayload = await this.handleAccessToken(client);

    if (jwtPayload) {
      const connectionRes = {
        connection_id: client.id,
        domain_name: client.handshake?.headers.host,
        user_id: jwtPayload.user_id,
      };

      // Add connection
      this.connectionsService.create(connectionRes);

      // all connections (connection_id) of the user to join a room (user_id)
      await client.join(jwtPayload.user_id);

      await this.messagesService.send(listenType.EVENT, jwtPayload.user_id, {
        user_id: jwtPayload.user_id,
        event: eventKey.CONNECTED,
      });
    } else {
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const jwtPayload = await this.handleAccessToken(client);

    if (jwtPayload) {
      this.connectionsService.updateStatus(
        client.id,
        connectionStatus.DISCONNECTED,
      );

      await client.leave(jwtPayload.user_id);

      const sockets = await this.server.in(jwtPayload.user_id).fetchSockets();
      if (sockets.length === 0) {
        // Handle disconneted to send another user in room when owner leave
      }
    }
  }

  async handleAccessToken(client: Socket): Promise<any> {
    let authToken: string = client.handshake?.headers?.authorization;

    if (!authToken) {
      authToken = client.handshake?.auth?.token;
    }

    if (!authToken) {
      return false;
    }

    authToken = authToken.replace('Bearer ', '');

    // Verify token
    const jwtPayload = await this.authService.jwtVerify(authToken);

    return jwtPayload;
  }
}
