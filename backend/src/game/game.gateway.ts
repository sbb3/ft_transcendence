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
import { Paddle, Ball, Gol, canvaState } from './game.interface';
import { update, mouvePaddle, bootPaddel } from './game.update';

@WebSocketGateway({
  namespace: 'play',
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

  canvaS: canvaState = {
    width: 600,
    height: 400,
  };

  mGol: Gol = {
    num: '5',
    x: 256,
    y: 40,
    color: 'white',
  };

  hGol: Gol = {
    num: '0',
    x: 768,
    y: 40,
    color: 'white',
  };

  ball: Ball = {
    x: this.canvaS.width / 2,
    y: this.canvaS.height / 2,
    radius: 10,
    speed: 2,
    velocityX: 2,
    velocityY: 2,
    color: 'white',
  };

  myP: Paddle = {
    x: 0,
    y: this.canvaS.height / 2 - 100 / 2,
    widthe: 10,
    height: 100,
    color: 'orange',
    score: 0,
  };

  herP: Paddle = {
    x: this.canvaS.width - 10,
    y: this.canvaS.height / 2 - 100 / 2,
    widthe: 10,
    height: 100,
    color: 'green',
    score: 0,
  };

  first: boolean = false;
  i: number = 0;
  room: string = 'room0';

  handleConnection(client: Socket, room: string) {
    // client.emit('initMyP', this.myP);
    // const accessToken = client.handshake.query.accessToken as string;
    // console.log(`accessToken`, accessToken);
    if (!this.first && this.i != 0) {
      room = 'room' + this.i;
      this.first = true;
    } else if (this.i == 0 && !this.first) {
      this.first = true;
    } else if (this.first) {
      room = 'room' + this.i;
      this.first = false;
      this.i++;
    }
    client.emit('name_room', room);
    this.logger.log(`room name for client : ${room}`);
    client.join(room);
    client.to(room).emit('join_room');
  }

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('initMyP')
  initMyPa(client: Socket): void {
    this.wss.emit('canvaState', this.canvaS, this.ball, this.herP, this.myP);
  }

  @SubscribeMessage('mvBall')
  mvBall(client: Socket) {
    this.ball = update(this.ball, this.canvaS, this.myP, this.herP);
    this.herP = bootPaddel(this.herP, this.canvaS, this.ball);
    client.emit('mvBall', this.ball);
    client.emit('bootPaddel', this.herP);
  }

  @SubscribeMessage('mvPaddle')
  mvPaddel(client: Socket, mouseY: number) {
    // console.log(mouseY);
    this.myP = mouvePaddle(this.myP, mouseY, this.canvaS);
    this.wss.emit('mvPaddle', this.myP);
  }

  @SubscribeMessage('ballMv')
  generateBallMv(client: Socket) {
    this.wss.emit('bal', this.ball);
  }

  // @SubscribeMessage('msgToServer')
  // handleMessage(client: Socket, message: string): void {
  //   client.broadcast.emit('message', message);
  //   // this.wss.emit('message', message);
  // }

  // @SubscribeMessage('upMyP')
  // update(client: Socket, myPO: Paddle): void{
  //   this.myP.x = myPO.x += 10;
  //   client.emit('update', this.myP);
  // }
  // upMyPad(client: Socket, message: string): void {
  //   client.broadcast.emit('message', message);
  //   // this.wss.emit('message', message);
  // }
}
