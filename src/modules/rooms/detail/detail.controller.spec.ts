import { Test, TestingModule } from '@nestjs/testing';
import { DetailController } from './detail.controller';
import { DetailService } from './detail.service';
import { AuthService } from './../../auth/auth.service';

import { commonModules } from '../../../config/common.module';
import { RoomsService } from '../rooms.service';

describe('DetailController', () => {
  let controller: DetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailService, AuthService, RoomsService],
      controllers: [DetailController],
      imports: [...commonModules],
    }).compile();

    controller = module.get<DetailController>(DetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
