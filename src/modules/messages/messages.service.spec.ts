import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';

import { commonModules } from '../../config/common.module';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService],
      imports: [...commonModules],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
