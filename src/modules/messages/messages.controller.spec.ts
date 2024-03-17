import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { AuthService } from '../auth/auth.service';
import { MessagesService } from '../messages/messages.service';

import { commonModules } from '../../config/common.module';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService, AuthService],
      controllers: [MessagesController],
      imports: [...commonModules],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
