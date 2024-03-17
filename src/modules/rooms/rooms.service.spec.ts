import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';

import { commonModules } from '../../config/common.module';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService],
      imports: [...commonModules],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
