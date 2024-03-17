import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';

import { commonModules } from '../../config/common.module';
import { ConnectionsService } from '../connections/connections.service';
import { MessagesService } from '../messages/messages.service';
import { AuthService } from '../auth/auth.service';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        ConnectionsService,
        MessagesService,
        AuthService,
      ],
      imports: [...commonModules],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
