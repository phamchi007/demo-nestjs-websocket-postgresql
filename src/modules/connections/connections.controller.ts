import { Controller } from '@nestjs/common';

import { ConnectionsService } from './connections.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}
}
