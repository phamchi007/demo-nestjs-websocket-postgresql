import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(username: string, password: string): Promise<any> {
    console.log(username, password);
    return {};
  }

  async jwtVerify(token: string): Promise<any> {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Check user active -> TODO

      return payload;
    } catch (err) {
      return false;
    }
    return payload;
  }
}
