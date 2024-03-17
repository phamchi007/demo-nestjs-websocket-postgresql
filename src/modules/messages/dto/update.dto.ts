import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class updateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  room_id: number;

  @IsNumber()
  @IsNotEmpty()
  message_id: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
