import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsService } from './connections.service';

import { commonModules } from '../../config/common.module';

describe('ConnectionsService', () => {
  let service: ConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionsService],
      imports: [...commonModules],
    }).compile();

    service = module.get<ConnectionsService>(ConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
