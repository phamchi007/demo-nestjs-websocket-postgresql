import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ConnectionEntity } from './entity/connection.entity';

import { connectionStatus } from '../../common/enum';

interface connectionCreate {
  connection_id: string;
  domain_name: string;
  user_id: number;
}

@Injectable()
export class ConnectionsService {
  private repository: Repository<ConnectionEntity>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ConnectionEntity);
  }

  async create(param: connectionCreate): Promise<ConnectionEntity> {
    const dataInsert = {
      connection_id: param.connection_id,
      domain_name: param.domain_name,
      user_id: param.user_id,
      status: 0,
    };

    const newEntity = this.repository.create(dataInsert);
    const resData = await this.repository.save(newEntity);

    return resData;
  }

  async updateStatus(connectionId: string, status: number): Promise<boolean> {
    const dataUpdate = {
      status: status,
    };

    if (status == connectionStatus.DISCONNECTED) {
      dataUpdate['disconnected_at'] = new Date();
    }

    try {
      // Check exist
      const entityToUpdate = await this.repository.findOneBy({
        ['connection_id']: connectionId,
      });

      if (entityToUpdate) {
        this.repository.update(entityToUpdate.id, dataUpdate);
      }
    } catch (err) {
      console.log(err);
      // No thing to do
    }

    return true;
  }
}
