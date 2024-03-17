import { IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {
  username: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  type: number;
}
