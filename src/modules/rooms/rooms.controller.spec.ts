import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthService } from '../auth/auth.service';
import { MessagesService } from '../messages/messages.service';
import { DetailService } from './detail/detail.service';

import { commonModules } from '../../config/common.module';

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, DetailService, AuthService, MessagesService],
      controllers: [RoomsController],
      imports: [...commonModules],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
