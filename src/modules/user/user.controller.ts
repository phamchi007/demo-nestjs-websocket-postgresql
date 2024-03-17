import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

import { Response } from 'express';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { signupWithNickNameDto } from './dto/user.dto';

import { UserService } from './user.service';

import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('signup-with-nickname')
  async signuprWithNickName(
    @Body({
      transform: async (value) => {
        let transformed: signupWithNickNameDto;
        if (value.nickname) {
          transformed = plainToInstance(signupWithNickNameDto, value);
        } else {
          throw new BadRequestException('Invalid user signup');
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
    signupDto: signupWithNickNameDto,
    @Res() res: Response,
  ) {
    // Create new user
    const userData = await this.userService.signUpWithNickName(
      signupDto.nickname,
    );

    const jwtPayload = {
      user_id: userData.id,
      type: userData.type,
    };

    // Create JWT to auth
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    res.status(HttpStatus.CREATED).send({
      access_token: accessToken,
      user_data: userData,
    });
  }
}
