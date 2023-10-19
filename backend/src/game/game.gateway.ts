import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';
import {Paddle, Ball, Gol, canvaState} from "./game.interface";
import {update, mouvePaddle} from "./game.update";

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

  canvaS : canvaState = {
    width : 600,
    height: 400
  }

  mGol: Gol = {
    num: "5",
    x: 256,
    y: 40,
    color: "white"

  };


  hGol: Gol = {
    num: "0",
    x: 768,
    y: 40,
    color: "white"
  };

  ball: Ball = {
    x: this.canvaS.width/2,
    y: this.canvaS.height/2,
    radius: 10,
    speed: 2,
    velocityX: 2,
    velocityY: 2,
    color : "white"
  };

  myP: Paddle = {
    x: 0,
    y: this.canvaS.height/2 - 100/2,
    widthe: 10,
    height: 100,
    color: "orange",
    score:0
  };

  herP: Paddle = {
    x: this.canvaS.width - 10,
    y: this.canvaS.height/2 - 100/2,
    widthe: 10,
    height: 100,
    color: "green",
    score:0
  };


  handleConnection(client: Socket, ...args: any[]) {
    // client.emit('initMyP', this.myP);
    this.logger.log(`Client connected: ${client.id}`);
  }

  afterInit(server: Server) {
    
    this.logger.log('Initialized');
  }



  @SubscribeMessage('initMyP')
  initMyPa(client: Socket):void{
    this.wss.emit('canvaState', this.canvaS);
    this.wss.emit('intBall', this.ball)
    this.wss.emit('herP', this.herP);
    this.wss.emit('myP', this.myP);
    this.wss.emit('myGol', this.mGol);
    this.wss.emit('herGol', this.hGol);
    
    // console.log(this.b);
  }


  @SubscribeMessage('mvBall')
  mvBall(client : Socket) {
    this.ball = update(this.ball, this.canvaS, this.myP, this.herP);
    this.herP.y += this.ball.y - (this.herP.y + this.herP.height / 2);
    this.wss.emit('mvBall', this.ball);
    this.wss.emit('bootPaddel', this.herP);
  }

  @SubscribeMessage('mvPaddle') 
  mvPaddel(client :Socket, mouseY) {
    this.myP = mouvePaddle(this.myP, mouseY)
    this.wss.emit('paddle', this.myP);
  }

  @SubscribeMessage('ballMv')
  generateBallMv(client :Socket) {
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
