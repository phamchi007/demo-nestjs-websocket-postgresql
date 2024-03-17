import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RoomDetailEntity } from './entity/room.detail.entity';
import { ConnectionEntity } from './../../connections/entity/connection.entity';

import { roomDetailStatus } from '../../../common/enum';

import { paginate } from './../../../common/helper';

@Injectable()
export class DetailService {
  private repository: Repository<RoomDetailEntity>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(RoomDetailEntity);
  }
  async addRoom(
    userId: number,
    roomId: number,
  ): Promise<RoomDetailEntity | boolean> {
    const dataInsert = {
      room_id: roomId,
      user_id: userId,
      status: roomDetailStatus.JOINING,
    };

    // Check exist
    const checkRoomDetailData = await this.findOneToCheckExist(userId, roomId);

    if (checkRoomDetailData) {
      return checkRoomDetailData;
    } else {
      // Add user into room
      const newEntity = this.repository.create(dataInsert);
      const roomDetailData = await this.repository.save(newEntity);

      return roomDetailData;
    }
  }

  async findOneToCheckExist(
    userId: number,
    roomId: number,
  ): Promise<RoomDetailEntity | null> {
    return this.repository.findOneBy({
      room_id: roomId,
      user_id: userId,
      status: 0,
    });
  }

  async findAllByRoomId(roomId: number, params: any): Promise<any> {
    // Get list items
    const { page = 1 } = params;
    const limit: number = 20;

    const skip: number = limit * page - limit;

    const connectionQuery = this.dataSource
      .getRepository(ConnectionEntity)
      .createQueryBuilder('Connections')
      .select('Connections.id')
      .where('Connections.user_id = room_detail.user_id')
      .andWhere('Connections.status = 0')
      .limit(1);

    const connectionQueryString = connectionQuery.getQuery();

    const queryObject = this.repository
      .createQueryBuilder('room_detail')
      .select([
        'room_detail.id as id',
        'room_detail.room_id as room_id',
        'room_detail.user_id as user_id',
        'user.nickname as nickname',
        'user.last_login_at as last_login_at',
        'room_detail.status as status',
        'room_detail.created_at as created_at',
      ])
      .addSelect('(((' + connectionQueryString + `) IS NOT NULL))`, 'is_online')
      .leftJoin('room_detail.user', 'user')
      .where('room_detail.room_id = :room_id', { room_id: roomId })
      .andWhere('room_detail.status = 0')
      .andWhere('room_detail.deleted_flg = 0')
      .orderBy('room_detail.created_at', 'DESC');

    const total = await queryObject.getCount();
    const dataList = await queryObject.limit(limit).offset(skip).getRawMany();

    return paginate({ datas: [...dataList], total: total }, page, limit);
  }
}
