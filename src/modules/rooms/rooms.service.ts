import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RoomEntity } from './entity/room.entity';
import { RoomDetailEntity } from './detail/entity/room.detail.entity';

import { roomType } from '../../common/enum';
import { paginate } from './../../common/helper';

@Injectable()
export class RoomsService {
  private repository: Repository<RoomEntity>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(RoomEntity);
  }

  async getList(userId: number, params: any): Promise<any> {
    const { page = 1 } = params;
    const limit = 20;

    const skip = limit * page - limit;

    // Select to check joined
    const roomDetailQuery = this.dataSource
      .getRepository(RoomDetailEntity)
      .createQueryBuilder('RoomDetail')
      .select('RoomDetail.id')
      .where('RoomDetail.room_id = rooms.id')
      .andWhere('RoomDetail.user_id = :user_id', { user_id: userId })
      .andWhere('RoomDetail.status = 0')
      .limit(1);

    const roomDetailQueryString = roomDetailQuery.getQuery();

    const queryObject = this.repository
      .createQueryBuilder('rooms')
      .select('rooms.*')
      .addSelect(`(rooms.user_created = '${userId}')`, 'is_owner')
      .addSelect(
        '(((' +
          roomDetailQueryString +
          `) IS NOT NULL) OR (rooms.user_created = '${userId}'))`,
        'is_joined',
      )
      .addSelect('user_owner.nickname', 'user_owner_nickname')
      .leftJoin('rooms.user_owner', 'user_owner')
      .setParameter('user_id', userId)
      .where('rooms.deleted_flg = 0')
      .orderBy('rooms.updated_at', 'DESC');

    const total = await queryObject.getCount();
    const dataList = await queryObject.limit(limit).offset(skip).getRawMany();

    return paginate({ datas: [...dataList], total: total }, page, limit);
  }

  async create(userId: number, roomName: string): Promise<RoomEntity> {
    const dataInsert = {
      room_name: roomName,
      user_created: userId,
      type: roomType.MULTI,
    };

    const newEntity = this.repository.create(dataInsert);
    const roomData = await this.repository.save(newEntity);

    return roomData;
  }

  async update(roomId: number, roomName: string): Promise<boolean> {
    const dataUpdate = {
      room_name: roomName,
      updated_at: new Date(),
    };

    await this.repository.update(roomId, dataUpdate);

    return true;
  }

  async remove(roomId: number): Promise<boolean> {
    const dataRemove = {
      deleted_flg: 1,
      updated_at: new Date(),
    };

    await this.repository.update(roomId, dataRemove);

    return true;
  }

  async findOneById(roomId: number): Promise<RoomEntity | null> {
    return this.repository.findOne({
      where: {
        id: roomId,
      },
      relations: ['user_owner'],
    });
  }
}
