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
import { Paddle, Ball, canvaState, Room } from './game.interface';
import { update, mouvePaddle, bootPaddel } from './game.update';
import { GameService } from './game.service';

// import { GameService } from './game.service';
// import { Inject } from '@nestjs/common';

@WebSocketGateway({
	namespace: 'play',
	cors: {
		origin: 'http://localhost:5173',
		credentials: true,
	},
})
export class GameGateway
	implements OnGatewayInit, OnGatewayDisconnect {

	constructor(
		private readonly gameService: GameService,

	) { }
	@WebSocketServer() wss: Server;

	// constructor(
	//   @Inject(GameService)
	//   private readonly gameService: GameService
	// ) {}

	private logger: Logger = new Logger('GameGateway');
	intervalId: number;

	// handleDisconnect(client: Socket) {
	//   client.leave(this.room);
	//   //if room empty delete from map and room

	//   // if (this.wss.sockets.adapter.rooms.get(this.room).size == 0)
	//   //   this.roomMap.delete(this.room);
	//   // // delete room from socket
	//   // this.wss.sockets.adapter.rooms.delete(this.room);

	//   this.logger.log(`Client disconnected: ${client.id}`);
	// }


	canvaS: canvaState = {
		width: 600,
		height: 400,
	};

	// mGol: Gol = {
	//   num: '5',
	//   x: 256,
	//   y: 40,
	//   color: 'white',
	// };

	// hGol: Gol = {
	//   num: '0',
	//   x: 768,
	//   y: 40,
	//   color: 'white',
	// };

	ball: Ball = {
		x: this.canvaS.width / 2,
		y: this.canvaS.height / 2,
		radius: 10,
		speed: 0.1,
		velocityX: 0,
		velocityY: 0,
		score_my: 0,
		score_her: 0,
		angle: Math.PI / 6,
		color: 'white',
	};

	myP: Paddle = {
		x: 0,
		y: this.canvaS.height / 2 - 100 / 2,
		widthe: 10,
		height: 100,
		color: 'orange',
	};

	herP: Paddle = {
		x: this.canvaS.width - 10,
		y: this.canvaS.height / 2 - 100 / 2,
		widthe: 10,
		height: 100,
		color: 'green',
	};

	first: boolean = false;
	i: number = 0;


	public roomMap: Map<string, Room> = new Map<string, Room>();


	handleConnection(client: Socket, data) {
	}


	private findKeyByValue(room, targetValue) {
		// console.log('room 2222==>   ', room.size, targetValue);
		for (const [roomName, value] of room) {
			// console.log(`value.idFirstPlayer ==> ${value.idFirstPlayer}  value.idSecondPlayer ==> ${value.idSecondPlayer} targetValue ==> ${targetValue}`);
			if (value.idFirstPlayer == targetValue || value.idSecondPlayer == targetValue)
				return roomName;

		}
		return null;
	}





	handleDisconnect(client: Socket) {





		const id_user = client.handshake.query.userId;

		// console.log('id_user ==> ', id_user);


		//get the room of client
		const room = this.findKeyByValue(this.roomMap, id_user);
		// console.log('value ==> ', room);
		if (!room)
			return;

		// console.log(`room  ==> ${room}`);
		const val = this.roomMap.get(room);
		if (!val) {
			// console.log('val222222  ==> ', val);
			return;
		}

		if (val.ball.score_her != 5 && val.ball.score_my != 5) {
			console.log("Room name : " + room);
			this.wss.to(room).emit('befforTime');
			// return;

		}
		if (!this.roomMap.get(room).endGame) {
			this.roomMap.get(room).endGame == true;
			this.endGame({
				data: {
					client: client,
					room,
					id_player: id_user,
					game_id: val.id_game,
				},
				intervalId: val.intervalId,
			})
		}
	}

	private endGame(info) {

		clearInterval(this.roomMap.get(info.data.room).intervalId);
		const id_player_one = this.roomMap.get(info.data.room).idFirstPlayer;
		const id_player_two = this.roomMap.get(info.data.room).idSecondPlayer;

		let player = '-1';
		if (this.roomMap.get(info.data.room).ball.score_my >= 5)
			player = this.roomMap.get(info.data.room).idFirstPlayer

		else if (this.roomMap.get(info.data.room).ball.score_her >= 5)
			player = this.roomMap.get(info.data.room).idSecondPlayer

		else {
			if (this.roomMap.get(info.data.room).idSecondPlayer != info.data.id_player)
				player = this.roomMap.get(info.data.room).idSecondPlayer
			else
				player = this.roomMap.get(info.data.room).idFirstPlayer
		}



		// console.log("After " + JSON.stringify(this.roomMap.get(info.data.room).intervalId));
		// console.log("AFter ", this.roomMap.get(info.data.room).intervalId);
		// console.log("Info id", info.intervalId);
		// this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(this.roomMap.get(info.data.room).idFirstPlayer, 10), "end");
		this.gameService.updateUserGameStatus(parseInt(id_player_one, 10), "online");
		this.gameService.updateUserGameStatus(parseInt(id_player_two, 10), "online");
		// const roomData = this.roomMap.get(info.data.room);
		// roomData.is_empty = true; // Update the value
		// this.roomMap.set(info.data.room, roomData);
		//change is_empty to true
		// this.roomMap.get(data.room).is_empty = true;
		// this.roomMap.get(data.room).is_empty === true;
		if (player != '-1')
			this.wss.to(info.data.room).emit('gameOver', player);
		this.roomMap.get(info.data.room).id_socket_first.leave(info.data.room);
		this.roomMap.get(info.data.room).id_socket_second.leave(info.data.room);

		// this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(this.roomMap.get(info.data.room).idSecondPlayer, 10), "end");
		// this.roomMap.delete(data.room.ball);
		// this.roomMap.delete(data.room.myPaddle);
		// this.roomMap.delete(data.room.herPaddle);
		// clearInterval(this.roomMap.get(info.data.room).intervalId);
		// if (player == '-1') {
		//   if ()
		//   this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(player, 10), "end");
		// }
		this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(player, 10), "end");
		this.gameService.updateUserIsWiner(parseInt(player, 10));
		this.roomMap.delete(info.data.room);
		// console.log('size ==> ', this.roomMap.size);



		// this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(this.roomMap.get(info.data.room).idFirstPlayer, 10), "end");
		// this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(player = this.roomMap.get(info.data.room).idSecondPlayer, 10), "end");
		// this.gameService.updatGameEnd(parseInt(info.data.game_id, 10), parseInt(player, 10), "end");

		// this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(info.data.room).idFirstPlayer, 10), "online");
		// this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(info.data.room).idSecondPlayer, 10), "online");
		// this.wss.to(info.data.room).emit('mvBall', this.ball);
	}


	afterInit(server: Server) {
		this.logger.log('Initialized');
	}


	// @SubscribeMessage('endGame')
	// emdGame(client: Socket, data) {

	//   // console.log('roomMap ====================> ', this.roomMap.get(data.room));
	//   // const room = this.findKeyByValue(this.roomMap, client.id);




	//   //get the room of client
	//   console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ==> ', data);

	//   // client.close();
	//   clearInterval(this.roomMap.get(data.room).intervalId);
	//   this.logger.log(`Client disconnected: ${client.id}`);
	//   this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(data.room).idFirstPlayer, 10), "online");
	//   this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(data.room).idSecondPlayer, 10), "online");


	//   if (this.roomMap.get(data.room).is_empty === false) {
	//     const roomData = this.roomMap.get(data.room);
	//     roomData.is_empty = true; // Update the value
	//     this.roomMap.set(data.room, roomData);
	//     //change is_empty to true
	//     // this.roomMap.get(data.room).is_empty = true;
	//     // this.roomMap.get(data.room).is_empty === true;
	//     client.leave(data.room);
	//   }
	//   else {
	//     client.leave(data.room);
	//     // this.roomMap.delete(data.room.ball);
	//     // this.roomMap.delete(data.room.myPaddle);
	//     // this.roomMap.delete(data.room.herPaddle);
	//     this.roomMap.delete(data.room);
	//     console.log('size ==> ', this.roomMap.size);
	//   }

	//   // this.endGame(data);
	// }



	@SubscribeMessage('initMyP')
	initMyPa(client: Socket, data): void {
		// console.log('clinet =======> ' ,client.id)
		// console.log(`incoming data from frontend : ${JSON.stringify(data)}`);
		if (data[0] != '') {
			if (!this.roomMap.has(data[0])) {
				client.join(data[0]);
				console.log("Room after joining : " + data[0]);
				this.roomMap.set(data[0], {
					startGame: false,
					endGame: false,
					id_game: data[2],
					idFirstPlayer: data[1],
					id_socket_first: client,
					idSecondPlayer: '',
					id_socket_second: '',
					myPaddle: Object.assign({}, this.myP),
					herPaddle: Object.assign({}, this.herP),
					ball: Object.assign({}, this.ball),
					intervalId: {},
					is_empty: false,
					canvasState: this.canvaS,
				});
			}
			else {
				client.join(data[0]);
				console.log("Second client : room after joining : " + data[0]);
				this.roomMap.set(data[0], {
					startGame: data[0].startGame,
					endGame: data[0].endGame,
					id_game: data[2],
					idFirstPlayer: this.roomMap.get(data[0]).idFirstPlayer,
					id_socket_first: this.roomMap.get(data[0]).id_socket_first,
					idSecondPlayer: data[1],
					id_socket_second: client,
					myPaddle: this.roomMap.get(data[0]).myPaddle,
					herPaddle: this.roomMap.get(data[0]).herPaddle,
					ball: this.roomMap.get(data[0]).ball,
					intervalId: {},
					is_empty: false,
					canvasState: this.roomMap.get(data[0]).canvasState,
				});
				this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(data[0]).idFirstPlayer, 10), "playing");
				this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(data[0]).idSecondPlayer, 10), "playing");
			}
			this.wss.to(data[0]).emit('initMyP', this.canvaS, this.roomMap.get(data[0]).ball, this.roomMap.get(data[0]).myPaddle, this.roomMap.get(data[0]).herPaddle);
		}
	}



	private start(data) {
		// if (this.roomMap.get(data.room).idFirstPlayer !== data.player_id) {
		const intervalId = setInterval(() => {

			if (data.room != '') {
				const updatedBall = update(this.roomMap.get(data.room)?.ball, this.roomMap.get(data.room)?.canvasState, this.roomMap.get(data.room)?.myPaddle, this.roomMap.get(data.room)?.herPaddle);

				// Get the room object from the Map
				const room = this.roomMap.get(data.room);

				// Update the ball property with the new ball object
				if (room) {
					room.ball = updatedBall;
					room.intervalId = intervalId;
				}
				this.roomMap.set(data.room, room);
				// this.roomMap.get(data.room).ball = update(this.roomMap.get(data.room)?.ball, this.roomMap.get(data.room)?.canvasState, this.roomMap.get(data.room)?.myPaddle, this.roomMap.get(data.room)?.herPaddle);
				if (this.roomMap.get(data.room).ball.score_my >= 5 || this.roomMap.get(data.room).ball.score_her >= 5) {
					console.log("I just ended the game.");
					this.endGame({
						data: data,
						intervalId: intervalId,
					})
					return;
				}
				this.wss.to(data.room).emit('mvBall', this.roomMap.get(data.room).ball);
			}
			// else {
			//   this.herP = bootPaddel(this.herP, this.canvaS, this.ball);
			//   data.client.emit('mvBall', this.ball);
			//   data.client.emit('Paddel', this.herP);
			// }
		}, 1000 / 60);

		// console.log("INterval id before", intervalId);
		// console.log(int);
		// }
	}


	@SubscribeMessage('mvBall')
	mvBall(client: Socket, data) {
		if (this.roomMap.get(data.room).startGame == false) {
			this.roomMap.get(data.room).startGame = true;
			// setTimeout(() => {
			console.log("Before start")
			this.start(
				{
					client: client,
					room: data.room,
					id_player: data.id_player,
					game_id: data.game_id,
				}
			);
			// }, 1000);
		}
	}

	@SubscribeMessage('mvPaddle')
	mvPaddel(client: Socket, data) {
		if (data.room != '') {
			if (this.roomMap.get(data.room).idFirstPlayer == data.id) {
				// console.log('one ==> ', this.roomMap.get(data.room).idFirstPlayer, data.id);

				this.roomMap.get(data.room).myPaddle = mouvePaddle(this.roomMap.get(data.room).myPaddle, data.num, this.roomMap.get(data.room).canvasState);
				this.wss.to(data.room).emit('mvPaddle', this.roomMap.get(data.room).myPaddle);
			} else {
				// console.log('two ==> ', this.roomMap.get(data.room).idSecondPlayer, data.id);

				// console.log('data two  ==> ', data.id);
				this.roomMap.get(data.room).herPaddle = mouvePaddle(this.roomMap.get(data.room).herPaddle, data.num, this.roomMap.get(data.room).canvasState);
				this.wss.to(data.room).emit('mvPaddle', this.roomMap.get(data.room).herPaddle);
			}
			// } else {
			//   this.myP = mouvePaddle(this.myP, data[0], this.canvaS);
			//   client.emit('mvPaddle', this.myP);
		}
	}
}
