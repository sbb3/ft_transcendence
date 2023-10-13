import {
  WebSocketGateway
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway {
  constructor() {}

  @WebSocketServer() private server: Server;

  sendChannelMessage(dataToSend: any) {
    this.server.emit('channelMessage', { data: dataToSend });
  }

  sendConversationMessage(dataToSend: any) {
    this.server.emit('conversationMessage', {data: dataToSend});
  }

  sendNewMemberData(dataToSend : any) {
    this.server.emit('channel', {data: dataToSend});
  }
}