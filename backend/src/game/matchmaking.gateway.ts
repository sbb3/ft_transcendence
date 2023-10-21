import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';
// import { Paddle, Ball, Gol, canvaState } from './game.interface';
// import { update, mouvePaddle, bootPaddel } from './game.update';

@WebSocketGateway({
  namespace: 'matchmaking',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GameGateway');

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, room: string) {
    client.emit('name_room', room);
    this.logger.log(`room name for client : ${room}`);
    client.join(room);
    client.to(room).emit('join_room');
  }

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  first: boolean = false;
  i: number = 0;
  room: string = 'room';

  @SubscribeMessage('join_queue')
  initMyPa(client: Socket, data): void {
    if (data.type == 'bot') {
      this.wss.emit('start_game', {
        data: {
          id: -1,
          type: 'bot',
          mode: '',
        },
      });
      return;
    }
    if (!this.first) {
      this.room = 'room' + this.i;
      client.join(this.room);
      this.first = true;
    } else if (this.first) {
      this.room = 'room' + this.i;
      client.join(this.room);

      this.wss.emit('start_game', {
        data: {
          id: 0,
          room: this.room,
        },
      });
      this.first = false;
      this.i++;
    }
  }

}
