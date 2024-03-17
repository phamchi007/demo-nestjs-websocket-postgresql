import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

import { RoomDetailEntity } from './../rooms/detail/entity/room.detail.entity';
import { MessageEntity } from './entity/message.entity';

import { paginate } from './../../common/helper';

import { listenType, messageKey, socketStatus } from '../../common/constants';
import { messageStatus, messageType } from '../../common/enum';

@Injectable()
@WebSocketGateway()
export class MessagesService {
  private roomDetailRepository: Repository<RoomDetailEntity>;
  private messageRepository: Repository<MessageEntity>;

  @WebSocketServer()
  server: Server;
  timeout: 1000;

  constructor(private dataSource: DataSource) {
    this.roomDetailRepository = this.dataSource.getRepository(RoomDetailEntity);
    this.messageRepository = this.dataSource.getRepository(MessageEntity);
  }

  async getList(userId: number, roomId: number, params: any): Promise<any> {
    const { page = 1 } = params;
    const limit = 20;

    const skip = limit * page - limit;

    // Need use lastID to resolve next page

    // userId for get message view status.

    const queryObject = this.messageRepository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.user', 'user')
      .where('messages.deleted_flg = 0')
      .where('messages.room_id = :room_id', { room_id: roomId })
      .orderBy('messages.created_at', 'DESC');

    const total = await queryObject.getCount();
    const dataList = await queryObject.limit(limit).offset(skip).getMany();

    return paginate({ datas: [...dataList], total: total }, page, limit);
  }

  async receiveMsg(userId: number, data: any) {
    // Validate data -> todo
    const roomId = data.room_id || null;
    const requestId = data.request_id || null;
    const message = data.message || '';

    if (!roomId || !requestId) {
      const receiveMsgObj = {
        request_id: requestId,
        user_id: userId,
        room_id: roomId,
        event: messageKey.SENT,
        status: socketStatus.FAILED,
        message_data: data,
      };

      await this.send(listenType.MESSAGES, userId, receiveMsgObj);
      return;
    }

    // check room
    const roomDetailCheck = await this.findOneToCheckExist(userId, roomId);

    const msgObj = {
      request_id: requestId,
      user_id: userId,
      room_id: roomId,
      event: messageKey.SENT,
      status: socketStatus.SUCCESS,
      message_data: null,
    };

    if (!roomDetailCheck) {
      msgObj.status = socketStatus.FAILED;
      await this.send(listenType.MESSAGES, userId, msgObj);
      return;
    }

    // save msg & need define data insert
    const dataInsert = {
      room_id: roomId,
      user_id: userId,
      message: message,
      status: messageStatus.NORMAL,
      type: messageType.TEXT,
    };

    // Need validate data insert -> TODO

    const newEntity = this.messageRepository.create(dataInsert);
    const messageData = await this.messageRepository.save(newEntity);

    msgObj.message_data = messageData;

    // Recheck multi server to send for user connected -> TODO

    // send to all user in room;
    await this.sendInRoom(listenType.MESSAGES, roomId, msgObj, []);
  }

  async send(event: string, toRoom: any, data: any) {
    this.server.sockets
      .to(toRoom)
      .timeout(this.timeout)
      .emit(event, JSON.stringify(data));
  }

  async sendInRoom(
    event: string,
    toRoom: any,
    data: any,
    anotherUser: number[],
  ) {
    const users = await this.findAllUsers(toRoom);
    for (const item of users) {
      if (anotherUser.length && anotherUser.includes(item.user_id)) {
        continue;
      }
      const sockets = await this.server.in(item.user_id).fetchSockets();
      if (sockets.length) {
        this.send(event, item.user_id, data);
      }
    }
  }

  async findAllUsers(roomId: number): Promise<any> {
    const result = await this.roomDetailRepository
      .createQueryBuilder('room_detail')
      .select([
        'room_detail.room_id as room_id',
        'room_detail.user_id as user_id',
      ])
      .leftJoin('room_detail.user', 'user')
      .where('room_detail.room_id = :room_id', { room_id: roomId })
      .andWhere('room_detail.status = 0')
      .andWhere('room_detail.deleted_flg = 0')
      .groupBy('room_detail.user_id, room_detail.room_id')
      .getRawMany();

    // Need cache

    return result;
  }

  async findOneToCheckExist(
    userId: number,
    roomId: number,
  ): Promise<RoomDetailEntity | null> {
    return this.roomDetailRepository.findOneBy({
      room_id: roomId,
      user_id: userId,
      status: 0,
    });
  }

  async update(messageId: number, message: string): Promise<boolean> {
    const dataUpdate = {
      message: message,
      updated_at: new Date(),
    };

    await this.messageRepository.update(messageId, dataUpdate);

    return true;
  }

  async findOneById(messageId: number): Promise<MessageEntity | null> {
    return this.messageRepository.findOne({
      where: {
        id: messageId,
      },
      relations: ['user'],
    });
  }

  async findLastInRoom(roomId: number): Promise<MessageEntity | null> {
    return this.messageRepository.findOne({
      where: {
        room_id: roomId,
      },
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }
}
