// import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  id: string;

  conversationId: string;

  type: string;

  sender: {
    id: number;
    email: string;
    name: string;
  };

  receiver: {
    id: number;
    email: string;
    name: string;
  };

  content: string;

  createdAt: number;
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
