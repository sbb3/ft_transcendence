import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace : '/chat', cors : true })
export class ChatGateway {
	constructor() {}

	@WebSocketServer() private server : Server;

	sendChannelMessage(dataToSend : any) {
		this.server.emit('channelMessage', dataToSend);
	}

	sendConversationMessage(dataToSend : any) {
		this.server.emit('conversationMessage', dataToSend);
	}
}
