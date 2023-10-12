import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer() private server: Server;

  sendChannelMessage(dataToSend: any) {
    // console.log(dataToSend);
    this.server.emit('channelMessage', { data: dataToSend });
  }

  sendConversationMessage(dataToSend: any) {
    const data = { data: dataToSend };
    this.server.emit('conversationMessage', data);
  }

  test(client: Socket) {
    // console.log('CLIENT: ', client);
  }
  @SubscribeMessage('test')
  lopez(client: Socket) {
    // console.log('loooooopez');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    // client.emit('initMyP', this.myP);
    console.log(`Client connected: ${client.id}`);
  }
}
