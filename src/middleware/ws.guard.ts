import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { AuthService } from './../modules/auth/auth.service';

@Injectable()
export class WSGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();

      let authToken: string = client.handshake?.headers?.authorization;

      if (!authToken) {
        authToken = client.handshake?.auth?.token;
      }

      authToken = authToken.replace('Bearer ', '');

      const payload = await this.authService.jwtVerify(authToken);

      if (payload) {
        client.authInfo = payload;

        return payload;
      } else {
        throw new WsException('Invalid access');
      }
    } catch (err) {
      throw new WsException('Invalid access');
    }
  }
}
