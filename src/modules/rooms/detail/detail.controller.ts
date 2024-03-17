import {
  Controller,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Request,
  Param,
  Query,
} from '@nestjs/common';

import { APIGuard } from '../../../middleware/api.guard';

import { Response } from 'express';

import { RoomsService } from './../rooms.service';
import { DetailService as RoomDetailService } from './detail.service';

@Controller('rooms/detail')
export class DetailController {
  constructor(
    private roomsService: RoomsService,
    private roomDetailService: RoomDetailService,
  ) {}

  @UseGuards(APIGuard)
  @Get(':room_id')
  async detail(
    @Request() req,
    @Param() params: any,
    @Query() query,
    @Res() res: Response,
  ) {
    const roomId: number = params.room_id;

    // Get room data
    const roomData = await this.roomsService.findOneById(roomId);

    // Get room detail with user list
    const roomUsers = await this.roomDetailService.findAllByRoomId(
      roomId,
      query,
    );

    res.status(HttpStatus.OK).send({
      room_data: roomData,
      room_users: roomUsers,
    });
  }
}
