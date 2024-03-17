import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class updateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  room_id: number;

  @IsString()
  @IsNotEmpty()
  room_name: string;
}
