// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  conversationId: string;

  @IsString()
  type: string;

  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;
}

/*
 {
      "id": "35a6393a-e53a-458b-9334-936abac9b8cf",
      "conversationId": "cafb1240-53a4-4d6a-bba1-af91ad006e34",
      "type": "message",
      "sender": {
        "id": 1,
        "email": "sbb3@gmail.com",
        "name": "sbb3"
      },
      "receiver": {
        "id": 2,
        "email": "lopez@gmail.com",
        "name": "lopez"
      },
      "content": "www",
      "createdAt": 1696633115131
    },
*/
