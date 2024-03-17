import { IsNotEmpty, IsNumber } from 'class-validator';
export class removeRoomDto {
  @IsNumber()
  @IsNotEmpty()
  room_id: number;
}
