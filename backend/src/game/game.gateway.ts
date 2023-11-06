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
import { Paddle, Ball, canvaState, Room, Boot } from './game.interface';
import { update, mouvePaddle, bootPaddel, setRandomDirection } from './game.update';
import { GameService } from './game.service';
import { PrismaClient } from '@prisma/client';


@WebSocketGateway({
	namespace: 'play',
	cors: {
		origin: 'http://localhost:5173',
		credentials: true,
	},
})
export class GameGateway extends PrismaClient
	implements OnGatewayInit, OnGatewayDisconnect {

	constructor(
		private readonly gameService: GameService,

	) {
		super();
	}
	@WebSocketServer() wss: Server;


	private logger: Logger = new Logger('GameGateway');
	intervalId: number;

	canvaS: canvaState = {
		width: 600,
		height: 400,
	};


	ball: Ball = {
		x: this.canvaS.width / 2,
		y: this.canvaS.height / 2,
		radius: 10,
		speed: 2.5,
		velocityX: 0,
		velocityY: 0,
		score_my: 0,
		score_her: 0,
		color: 'white',
		angl: setRandomDirection(),
	};

	myP: Paddle = {
		x: 0,
		y: this.canvaS.height / 2 - 100 / 2,
		widthe: 10,
		height: 100,
		color: 'white',
	};

	herP: Paddle = {
		x: this.canvaS.width - 10,
		y: this.canvaS.height / 2 - 100 / 2,
		widthe: 10,
		height: 100,
		color: 'white',
	};

	first: boolean = false;
	i: number = 0;


	public roomMap: Map<string, Room> = new Map<string, Room>();
	public bootMap: Map<number, Boot> = new Map<number, Boot>();




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

	private idUserInRoom(socketId) {
		for (const value of this.bootMap.values()) {
			if (value.socket == socketId)
				return value.idUser;
		}
		for (const value of this.roomMap.values()) {
			if (value.socket_first == socketId || value.socket_second == socketId)
				return value.idFirstPlayer;
		}
		return null;
	}



	handleDisconnect(client: Socket) {

		// console.log('Client disconnected:' ,client.handshake.query);
		// console.log("id_user ==> ", client.handshake.query.userId);
		// const id_user = client.handshake.query.userId.toString();

		const id_user = this.idUserInRoom(client);
		console.log('id_user ==> ', id_user);
		// convert id_user to number
		// id_user.toString();
		//check if client.id is in bootMap
		if (this.bootMap.has(parseInt(id_user, 10))) {
			clearInterval(this.bootMap.get(parseInt(id_user, 10)).intervalId);
			console.log("client.id is in bootMap gameOver");
			this.wss.to(client.id).emit('gameOver', parseInt(id_user, 10));
			this.bootMap.delete(parseInt(id_user, 10));
			console.log('size of bootMap ==> ', this.bootMap.size)
		}
		else {




			// console.log('id_user ==> ', id_user);


			//get the room of client
			const room = this.findKeyByValue(this.roomMap, id_user);
			// console.log('value ==> ', room);
			if (!room)
				return;

			// console.log(`room  ==> ${room}`);
			const val = this.roomMap.get(room);
			if (!val) {
				console.log('val222222  ==> ', val);
				return;
			}

			if (val.ball.score_her != 5 && val.ball.score_my != 5) {
				console.log("Room name : " + room);
				this.wss.to(room).emit('befforTime');
				// return;

			}
			console.log("Engame here is " + this.roomMap.get(room).endGame);
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
					playersScore: {
						score_my: val.ball.score_my,
						score_her: val.ball.score_her,
					}
				})
			}
		}
	}

	private endGame(info) {

		clearInterval(this.roomMap.get(info.data.room).intervalId);
		const id_player_one = this.roomMap.get(info.data.room).idFirstPlayer;
		const id_player_two = this.roomMap.get(info.data.room).idSecondPlayer;

		let player = '-1';
		if (this.roomMap.get(info.data.room).ball.score_my >= 5) {
			player = this.roomMap.get(info.data.room).idFirstPlayer
			this.gameService.updateUserIsLoser(parseInt(this.roomMap.get(info.data.room).idSecondPlayer, 10));
			// this.wss.to(info.data.room).emit('gameOver', player);
		}

		else if (this.roomMap.get(info.data.room).ball.score_her >= 5) {
			player = this.roomMap.get(info.data.room).idSecondPlayer
			this.gameService.updateUserIsLoser(parseInt(this.roomMap.get(info.data.room).idFirstPlayer, 10));
			// this.wss.to(info.data.room).emit('gameOver', player);
		}

		else {
			if (this.roomMap.get(info.data.room).idSecondPlayer != info.data.id_player) {
				this.gameService.updateUserIsLoser(parseInt(this.roomMap.get(info.data.room).idFirstPlayer, 10));
				player = this.roomMap.get(info.data.room).idSecondPlayer
			}
			else {
				this.gameService.updateUserIsLoser(parseInt(this.roomMap.get(info.data.room).idSecondPlayer, 10));
				player = this.roomMap.get(info.data.room).idFirstPlayer
			}
		}


		this.gameService.updateUserGameStatus(parseInt(id_player_one, 10), "online");
		this.gameService.updateUserGameStatus(parseInt(id_player_two, 10), "online");
		this.gameService.updateUserIsWiner(parseInt(player, 10));



		this.wss.to(info.data.room).emit('gameOver', player);
		this.roomMap.get(info.data.room).socket_first.leave(info.data.room);
		this.roomMap.get(info.data.room).socket_second.leave(info.data.room);

		this.gameService.updatGameEnd({
			gameId: parseInt(info.data.game_id, 10),
			id_winer: parseInt(player, 10),
			status: "FINISHED",
			player_one_score: info.playersScore.score_my,
			player_two_score: info.playersScore.score_her,
		});
		this.roomMap.delete(info.data.room);

	}

	afterInit(server: Server) {
		this.logger.log('Initialized');
	}


	@SubscribeMessage('initMyP')
	async initMyPa(client: Socket, data) {
		// console.log("idfirstplayer ", this.roomMap.get(data[0]).idFirstPlayer);
		if (data[0] != null) {
			const game = await this.game.findUnique({
				where: {
					id: data[2]
				}
			})
			if (!game) {
				console.log("game not found");
				return;
			}
			if (!this.roomMap.has(data[0])) {
				client.join(data[0]);
				console.log("Room after joining : " + data[0]);
				this.roomMap.set(data[0], {
					startGame: false,
					endGame: false,
					id_game: data[2],
					idFirstPlayer: game.player_one_id.toString(),
					socket_first: client,
					idSecondPlayer: '',
					socket_second: '',
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
					...this.roomMap.get(data[0]),
					idSecondPlayer: game.player_two_id.toString(),
					socket_second: client,
				});
				this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(data[0]).idFirstPlayer, 10), "playing");
				this.gameService.updateUserGameStatus(parseInt(this.roomMap.get(data[0]).idSecondPlayer, 10), "playing");
			}
			console.log('obj', this.roomMap.get(data[0]).startGame, this.roomMap.get(data[0]).endGame);
			// console.log('roomMap ==> ', this.roomMap);
			this.wss.to(data[0]).emit('initMyP', this.canvaS, this.roomMap.get(data[0]).ball, this.roomMap.get(data[0]).myPaddle, this.roomMap.get(data[0]).herPaddle);
		}
		else {
			this.bootMap.set(data[1], {
				mode: data[3],
				idUser: data[1],
				socket: client,
				myPaddle: Object.assign({}, this.myP),
				bootPaddle: Object.assign({}, this.herP),
				ball: Object.assign({}, this.ball),
				canvasState: Object.assign({}, this.canvaS),
				intervalId: {},
				isDone: false,
			});
			this.wss.to(client.id).emit('initMyP', this.canvaS, this.bootMap.get(data[1]).ball, this.bootMap.get(data[1]).myPaddle, this.bootMap.get(data[1]).bootPaddle);
			console.log("booot game");
		}
	}



	private start(data) {

		console.log("Set interval here");
		const intervalId = setInterval(() => {

			if (data.room != null) {
				// console.log('size of roomMap ==> ', this.roomMap.size)
				if (this.roomMap.has(data.room)) {
					this.roomMap.get(data.room).ball = update(this.roomMap.get(data.room)?.ball, this.roomMap.get(data.room)?.canvasState, this.roomMap.get(data.room)?.myPaddle, this.roomMap.get(data.room)?.herPaddle, null);
					// console.log('bbbbbb' , this.roomMap.get(data.room).ball);
					if (this.roomMap.get(data.room).ball.score_my >= 5 || this.roomMap.get(data.room).ball.score_her >= 5) {
						console.log("I just ended the game.");
						// clearInterval(intervalId);
						this.endGame({
							data: data,
							intervalId: intervalId,
							playersScore: {
								score_my: this.roomMap.get(data.room).ball.score_my,
								score_her: this.roomMap.get(data.room).ball.score_her,
							}
						})
						return;
					}
					this.wss.to(data.room).emit('mvBall', this.roomMap.get(data.room).ball);
				}
			}
			else {
				// console.log("start boot game");
				// console.log("data.id_player ==> ", data.id_player);
				this.bootMap.get(data.id_player).intervalId = intervalId;
				this.bootMap.get(data.id_player).ball = update(this.bootMap.get(data.id_player).ball, this.bootMap.get(data.id_player).canvasState, this.bootMap.get(data.id_player).myPaddle, this.bootMap.get(data.id_player).bootPaddle, data.mode);
				// console.log(this.bootMap.get(data.id_player).ball)
				if (this.bootMap.get(data.id_player).ball.score_my >= 5 || this.bootMap.get(data.id_player).ball.score_her >= 5) {
					if (this.bootMap.get(data.id_player).ball.score_my >= 5)
						this.wss.to(data.client.id).emit('gameOver', data.id_player);
					else
						this.wss.to(data.client.id).emit('gameOver', -1);
					clearInterval(this.bootMap.get(parseInt(data.id_player, 10)).intervalId);
					this.bootMap.delete(parseInt(data.id_player, 10));
					return;
				}
				this.wss.to(data.client.id).emit('mvBall', this.bootMap.get(data.id_player).ball);
				this.bootMap.get(data.id_player).bootPaddle = bootPaddel(this.bootMap.get(data.id_player).bootPaddle, this.bootMap.get(data.id_player).canvasState, this.bootMap.get(data.id_player).ball, data.mode);
				this.wss.to(data.client.id).emit('mvBootPaddle', this.bootMap.get(data.id_player).bootPaddle);
				// data.client.emit('mvBall', this.ball);
				// data.client.emit('Paddel', this.herP);
			}
		}, 1000 / 60);
	}


	@SubscribeMessage('mvBall')
	mvBall(client: Socket, data) {
		if (data[0] != null) {
			if (this.roomMap.get(data.room).startGame == false) {
				console.log('sssssssssssssssssssssssssssss');
				this.roomMap.get(data.room).startGame = true;
			}
		}
		console.log("HEre please");
		// setTimeout(() => {
		this.start(
			{
				client: client,
				room: data.room,
				id_player: data.player_id,
				game_id: data.game_id,
				mode: data.mode,
			}
		);
		// }, 1000);

	}

	@SubscribeMessage('mvPaddle')
	mvPaddel(client: Socket, data) {
		// console.log("HEre please");
		if (data.room != null) {
			if (this.roomMap.get(data.room)?.idFirstPlayer == data.id) {
				// console.log('one ==> ', this.roomMap.get(data.room).idFirstPlayer, data.id);

				// console.log("Room to emit my paddle : " + data.room);
				this.roomMap.get(data.room).myPaddle = mouvePaddle(this.roomMap.get(data.room).myPaddle, data.num, this.roomMap.get(data.room).canvasState);
				this.wss.to(data.room).emit('mvPaddle', this.roomMap.get(data.room).myPaddle);
			} else if (this.roomMap.get(data.room)?.idSecondPlayer == data.id) {
				// console.log('two ==> ', this.roomMap.get(data.room).idSecondPlayer, data.id);

				// console.log('data two  ==> ', data.id);
				// console.log("Room to emit herpaddle : " + data.room);
				this.roomMap.get(data.room).herPaddle = mouvePaddle(this.roomMap.get(data.room).herPaddle, data.num, this.roomMap.get(data.room).canvasState);
				this.wss.to(data.room).emit('mvPaddle', this.roomMap.get(data.room).herPaddle);
			}
			// } else {
			//   this.myP = mouvePaddle(this.myP, data[0], this.canvaS);
			//   client.emit('mvPaddle', this.myP);
		}
		else {
			this.bootMap.get(data.id).myPaddle = mouvePaddle(this.bootMap.get(data.id).myPaddle, data.num, this.bootMap.get(data.id).canvasState);
			this.wss.to(client.id).emit('mvPaddle', this.bootMap.get(data.id).myPaddle);
		}
	}
}
