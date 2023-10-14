import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';
import {Paddle, Ball, Gol} from "./game.interface";

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

  b: Ball = {
    x: 512,
    y: 288,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color : "white"
  };

  myP: Paddle = {
    x: 20,
    y: 300,
    widthe: 20,
    hweight: 90,
    color: "orange",
    score:0
  };

  herP: Paddle = {
    x: 984,
    y: 140,
    widthe: 20,
    hweight: 90,
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
    // this.logger.log('initMyP');
    // p == this.myP;
    // return (event : 'initMyP', p: this.myP);
    // client.broadcast.emit('initMyP', this.myP);
    this.wss.emit('herP', this.herP);
    this.wss.emit('myP', this.myP);
    this.wss.emit('myGol', this.mGol);
    this.wss.emit('herGol', this.hGol);
    
    // console.log(this.b);
  }


  @SubscribeMessage('ballMv')
  generateBallMv(client :Socket) {
    this.wss.emit('bal', this.b);
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
