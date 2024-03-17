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

import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { APIGuard } from '../../middleware/api.guard';

import { MessagesService } from './messages.service';

import { updateMessageDto } from './dto/update.dto';

import { listenType, messageKey, socketStatus } from '../../common/constants';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @UseGuards(APIGuard)
  @Get()
  async list(@Request() req, @Query() query, @Res() res: Response) {
    const authInfo: any = req.authInfo;
    const userId = authInfo.user_id;
    const roomId = Number(query.room_id || null);

    if (!roomId || isNaN(roomId)) {
      throw new BadRequestException('Invalid request');
    }

    // Create new room
    const rooms = await this.messagesService.getList(userId, roomId, query);

    res.status(HttpStatus.OK).send(rooms);
  }

  @UseGuards(APIGuard)
  @Post('update')
  async update(
    @Request() req,
    @Body({
      transform: async (value) => {
        let transformed: updateMessageDto;
        if (value.message_id && value.message_id && value.room_id) {
          transformed = plainToInstance(updateMessageDto, value);
        } else {
          throw new BadRequestException('Invalid message update');
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
    updateMessageDto: updateMessageDto,
    @Res() res: Response,
  ) {
    const authInfo: any = req.authInfo;
    const userId = authInfo.user_id;

    // Check exist and is owner
    const messageData = await this.messagesService.findLastInRoom(
      updateMessageDto.room_id,
    );

    if (!messageData) {
      throw new BadRequestException('Invalid message update');
    }

    if (
      messageData.id != updateMessageDto.message_id ||
      messageData.user_id != userId
    ) {
      throw new BadRequestException('Invalid message update');
    }

    // Update message
    const newMessageData = await this.messagesService.update(
      updateMessageDto.message_id,
      updateMessageDto.message,
    );

    if (newMessageData) {
      messageData.message = updateMessageDto.message;
    }

    const msgObj = {
      user_id: userId,
      room_id: updateMessageDto.room_id,
      event: messageKey.UPDATED,
      status: socketStatus.SUCCESS,
      message_data: messageData,
    };

    // Send notification for this user, that's joined.
    await this.messagesService.send(listenType.MESSAGES, userId, msgObj);

    // End another users in the room

    await this.messagesService.sendInRoom(
      listenType.MESSAGES,
      updateMessageDto.room_id,
      msgObj,
      [userId],
    );

    res.status(HttpStatus.OK).send({
      message_data: messageData,
    });
  }
}
