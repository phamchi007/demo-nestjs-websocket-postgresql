import { IsNotEmpty, IsString } from 'class-validator';
export class createRoomDto {
  @IsString()
  @IsNotEmpty()
  room_name: string;

  user_created: number;
  type: number;
}
