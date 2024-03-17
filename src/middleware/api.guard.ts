import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

import { AuthService } from './../modules/auth/auth.service';

@Injectable()
export class APIGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      let authToken: string = request.headers?.authorization;
      authToken = authToken.replace('Bearer ', '');

      const payload = await this.authService.jwtVerify(authToken);

      if (payload) {
        request.authInfo = payload;

        return payload;
      } else {
        throw new BadRequestException('Invalid access');
      }
    } catch (err) {
      throw new BadRequestException('Invalid access');
    }
  }
}
