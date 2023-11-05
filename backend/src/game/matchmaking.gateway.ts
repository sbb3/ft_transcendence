import { Logger, Injectable } from '@nestjs/common';
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


import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

import { PrismaClient } from '@prisma/client';


@WebSocketGateway({
	namespace: 'matchmaking',
	cors: {
		origin: 'http://localhost:5173',
		credentials: true,
	},
})
@Injectable()
export class MatchmakingGateway
	implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
	constructor(
		private readonly gameService: GameService,

	) { }


	first: boolean = false;
	i: number = 0;
	room: string = 'room';
	id: number = -1;
	firstUserId: number = -1;
	gameTable;

	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('GameGateway');

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		if (this.first) {
			this.first = false;
			this.firstUserId = -1;
		}
		this.logger.log(`Client disconnected looopez: ${client.id}`);
	}

	afterInit(server: Server) {
		this.logger.log('Initialized');
	}


	@SubscribeMessage('cancelMatchmaking')
	cancelMatchmaking(client: Socket) {
		console.log('cancel matchmaking');
		this.first = false;
		this.firstUserId = -1;
	}

	@SubscribeMessage('accept_game_challenge')
	async acceptGameChallenge(client: Socket, data) {
		console.log("accept game challenge in the backend")
		this.room = 'room' + this.i;
		this.i++;

		console.log(`room name for client : ${this.room}`);
		console.log("data : ", data)
		const game = await this.gameService.createGame({
			player_one_id: data.challengedUserId,
			player_two_id: data.challengerUserId,
			id_winer: -1,
			status: 'playing',
			createdAt: new Date(),
		});
		console.log('players ids : ', data.challengedUserId, data.challengerUserId)
		if (!game) {
			console.log('errro game');
		}

		this.wss.emit('game_accepted', {
			gameInfo: {
				id: game?.id,
				room: this.room,
				players: [data.challengedUserId, data.challengerUserId],
			},
		});
	}


	@SubscribeMessage('join_queue')
	async initMyPa(client: Socket, data) {
		console.log('id of the first user ', this.i);
		console.log(`incoming data from frontend : ${client?.id}, ${JSON.stringify(data)}`);
		if (data.gameType === "bot") {

			this.wss.emit('start_game', {
				gameInfo: {
					players: [data.userId],
					// gameType: "Bot",
					mode: data?.gameMode,
				},
			});
			console.log('bot game');
			return;
		}
		else {

			console.log(`first : ${this.first}`);

			if (!this.first) {

				this.firstUserId = data.userId;
				this.first = true;

			} else if (this.first) {
				this.room = 'room' + this.i;

				console.log(`room name for client : ${this.room}`);
				this.gameTable = {
					player_one_id: this.firstUserId,
					player_two_id: data.userId,
					id_winer: -1,
					status: 'playing',
					createdAt: new Date(),
				};

				const game = await this.gameService.createGame(this.gameTable);
				if (!game) {
					console.log('errro game');
				}

				console.log("Room before joining" + this.room);
				this.wss.emit('start_game', {
					gameInfo: {
						id: game?.id,
						room: this.room,
						players: [this.firstUserId, data.userId],
					},
				});
				this.firstUserId = -1;
				this.first = false;
				this.i++;
			}
		}
	}
}

