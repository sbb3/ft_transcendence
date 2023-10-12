import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';
import {Paddle, Ball} from "./game.interface";

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

  b: Ball = {
    x: 512,
    y: 288,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color : "WHITE"
  };

  myP: Paddle = {
    x: 20,
    y: 300,
    widthe: 20,
    hweight: 90,
    color: "orange",
    score:0
  };

  htP: Paddle = {
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



  // initHerP(client: Socket){

  // }
  
  // initBall(client: Socket){

  // }

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }



  @SubscribeMessage('start')
  initMyP(client: Socket, data: Paddle):void{
    // this.logger.log('initMyP');
    // p == this.myP;
    // return (event : 'initMyP', p: this.myP);
    client.emit('initMyP', this.myP);
    console.log(this.myP);
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
