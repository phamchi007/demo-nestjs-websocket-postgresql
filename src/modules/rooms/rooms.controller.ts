import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpStatus,
  BadRequestException,
  ValidationPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';

import { APIGuard } from '../../middleware/api.guard';

import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { RoomsService } from './rooms.service';
import { DetailService as RoomDetailService } from './detail/detail.service';

import { MessagesService } from './../messages/messages.service';

import { listenType, eventKey } from '../../common/constants';

import { createRoomDto } from './dto/create.dto';
import { updateRoomDto } from './dto/update.dto';
import { joinRoomDto } from './dto/join.dto';
import { removeRoomDto } from './dto/remove.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private roomDetailService: RoomDetailService,
    private messagesService: MessagesService,
  ) {}

  @UseGuards(APIGuard)
  @Get()
  async list(@Request() req, @Query() query, @Res() res: Response) {
    const authInfo: any = req.authInfo;

    // Create new room
    const rooms = await this.roomsService.getList(authInfo.user_id, query);

    res.status(HttpStatus.OK).send(rooms);
  }

  @UseGuards(APIGuard)
  @Post('create')
  async create(
    @Request() req,
    @Body({
      transform: async (value) => {
        let transformed: createRoomDto;
        if (value.room_name) {
          transformed = plainToInstance(createRoomDto, value);
        } else {
          throw new BadRequestException('Invalid room create');
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    createRoomDto: createRoomDto,
    @Res() res: Response,
  ) {
    const authInfo: any = req.authInfo;

    // Create new room
    const roomData = await this.roomsService.create(
      authInfo.user_id,
      createRoomDto.room_name,
    );

    // Auto add room detail
    await this.roomDetailService.addRoom(authInfo.user_id, roomData.id);

    res.status(HttpStatus.CREATED).send({
      room_data: roomData,
    });
  }

  @UseGuards(APIGuard)
  @Post('update')
  async update(
    @Request() req,
    @Body({
      transform: async (value) => {
        let transformed: updateRoomDto;
        if (value.room_name) {
          transformed = plainToInstance(updateRoomDto, value);
        } else {
          throw new BadRequestException('Invalid room update');
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    updateRoomDto: updateRoomDto,
    @Res() res: Response,
  ) {
    const authInfo: any = req.authInfo;
    const userId = authInfo.user_id;

    // Check exist and is owner
    const roomData = await this.roomsService.findOneById(updateRoomDto.room_id);

    if (!roomData || roomData.user_created != userId) {
      throw new BadRequestException('Invalid room update');
    }

    // Update room
    const newRoomData = await this.roomsService.update(
      updateRoomDto.room_id,
      updateRoomDto.room_name,
    );

    if (newRoomData) {
      roomData.room_name = updateRoomDto.room_name;
    }

    const msgObj = {
      user_id: userId,
      room_id: updateRoomDto.room_id,
      event: eventKey.UPDATED_ROOM,
      room_data: roomData,
    };

    // Send notification for this user, that's joined.
    await this.messagesService.send(listenType.EVENT, userId, msgObj);

    // End another users in the room

    await this.messagesService.sendInRoom(
      listenType.EVENT,
      updateRoomDto.room_id,
      msgObj,
      [userId],
    );

    res.status(HttpStatus.OK).send({
      room_data: roomData,
    });
  }

  @UseGuards(APIGuard)
  @Post('join')
  async joinRoom(
    @Request() req,
    @Body({
      transform: async (value) => {
        let transformed: joinRoomDto;
        if (value.room_id) {
          transformed = plainToInstance(joinRoomDto, value);
        } else {
          throw new BadRequestException('Invalid join room');
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    joinRoomDto: joinRoomDto,
    @Res() res: Response,
  ) {
    const authInfo: any = req.authInfo;
    const userId = authInfo.user_id;

    // Check exist and is owner
    const roomData = await this.roomsService.findOneById(joinRoomDto.room_id);

    if (!roomData) {
      throw new BadRequestException('Invalid join room');
    }

    if (roomData.user_created == userId) {
      return res.status(HttpStatus.OK).send({
        room_data: roomData,
      });
    }

    // Add room
    const roomDetailData = await this.roomDetailService.addRoom(
      userId,
      joinRoomDto.room_id,
    );

    if (!roomDetailData) {
      throw new BadRequestException('Invalid join room');
    }

    const msgObj = {
      user_id: userId,
      room_id: joinRoomDto.room_id,
      event: eventKey.JOINED_ROOM,
    };

    // Send notification for this user, that's joined.
    await this.messagesService.send(listenType.EVENT, userId, msgObj);

    // End another users in the room

    await this.messagesService.sendInRoom(
      listenType.EVENT,
      joinRoomDto.room_id,
      msgObj,
      [userId],
    );

    res.status(HttpStatus.OK).send({
      room_data: roomData,
    });
  }

  @UseGuards(APIGuard)
  @Post('remove')
  async removeRoom(
    @Request() req,
    @Body({
      transform: async (value) => {
        let transformed: removeRoomDto;
        if (value.room_id) {
          transformed = plainToInstance(removeRoomDto, value);
        } else {
          throw new BadRequestException('Invalid remove room');
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    removeRoomDto: removeRoomDto,
    @Res() res: Response,
  ) {
    const authInfo: any = req.authInfo;
    const userId = authInfo.user_id;

    // Check exist and is owner
    const roomData = await this.roomsService.findOneById(removeRoomDto.room_id);

    if (!roomData || roomData.user_created != userId) {
      throw new BadRequestException('Invalid remove room');
    }

    // Remove room
    const newRoomData = await this.roomsService.remove(removeRoomDto.room_id);

    if (!newRoomData) {
      throw new BadRequestException('Invalid remove room');
    }

    // Remove all room detail
    // coding here

    const msgObj = {
      user_id: userId,
      room_id: removeRoomDto.room_id,
      event: eventKey.REMOVED_ROOM,
    };

    // Send notification for this user, that's joined.
    await this.messagesService.send(listenType.EVENT, userId, msgObj);

    // End another users in the room

    await this.messagesService.sendInRoom(
      listenType.EVENT,
      removeRoomDto.room_id,
      msgObj,
      [userId],
    );

    res.status(HttpStatus.CREATED).send({
      status: true,
    });
  }
}
