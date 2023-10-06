import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService extends PrismaClient {

	async createMessage(messageDto : CreateMessageDto) {
		console.log(messageDto);
	}
}