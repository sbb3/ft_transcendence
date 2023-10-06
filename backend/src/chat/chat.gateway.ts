import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace : '/chat', cors : true })
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}

	@SubscribeMessage('message')
	sendMessage() {

	}
}
