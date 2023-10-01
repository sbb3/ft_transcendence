import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';

@WebSocketGateway( {
  namespace : 'play',
  cors: {
    origin : "http://localhost:5173",
    credentials: true,
  }
})

export class GameGateway implements OnGatewayInit,  OnGatewayConnection, OnGatewayDisconnect{


  @WebSocketServer() wss: Server;

  private logger:Logger = new Logger('GameGateway');

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }


  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }


  afterInit(server: Server) {
    this.logger.log('Initialized');
  }


  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: string): void {
    client.broadcast.emit('message', message);
    // this.wss.emit('message', message);
  }
}
