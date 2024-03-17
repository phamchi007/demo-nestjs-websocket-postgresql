import { IsNotEmpty, IsNumber } from 'class-validator';
export class joinRoomDto {
  @IsNumber()
  @IsNotEmpty()
  room_id: number;
}
