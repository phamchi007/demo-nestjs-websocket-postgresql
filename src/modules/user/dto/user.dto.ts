import { IsNotEmpty, IsString } from 'class-validator';

export class signupWithNickNameDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
