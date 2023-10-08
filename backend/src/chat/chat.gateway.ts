import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace : '/chat', cors : true })
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}

	@WebSocketServer() server : Server;

	@SubscribeMessage('channelMessage')
	sendChannelMessage(client : Socket, data : any) {
		this.server.emit('channelMessage', data);
	}

	@SubscribeMessage('conversationMessage')
	sendConversationMessage(client : Socket, data : any) {
		this.server.emit('conversationMessage', data);
	}
}
