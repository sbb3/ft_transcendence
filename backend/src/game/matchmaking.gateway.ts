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

	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('GameGateway');

	handleConnection(client: Socket, ...args: any[]) {
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
		this.first = false;
		this.firstUserId = -1;
	}

	@SubscribeMessage('accept_game_challenge')
	async acceptGameChallenge(client: Socket, data) {
		const challengedUserIdStatus = await this.gameService.getUserStatus(data.challengedUserId);
		const challengerUserIdStatus = await this.gameService.getUserStatus(data.challengerUserId);
		if (challengedUserIdStatus !== "online" || challengerUserIdStatus !== "online")
			return;
		this.room = 'room' + this.i;
		this.i++;
		const user1 = await this.gameService.getUserById(data.challengerUserId);
		const user2 = await this.gameService.getUserById(data.challengedUserId);
		const game = await this.gameService.createGame({
			player_one_id: data.challengerUserId,
			player_two_id: data.challengedUserId,
			player_one_score: 0,
			player_two_score: 0,
			id_winer: -1,
			status: 'playing',
			createdAt: new Date(),
		});
		if (!game) {
			console.log('errro game');
		}

		this.wss.emit('game_accepted', {
			gameInfo: {
				id: game?.id,
				room: this.room,
				players: [user1, user2],
				gameMode: "Multiplayer",

			},
		});
	}


	@SubscribeMessage('join_queue')
	async initMyPa(client: Socket, data) {
		const userStatus = await this.gameService.getUserStatus(data.userId);
		if (userStatus !== "online")
			return;
		if (data.gameType === "bot") {
			const user1 = await this.gameService.getUserById(data.userId);
			this.wss.emit('start_game', {
				gameInfo: {
					players: [user1],
					mode: data?.gameMode,
					gameMode: "Bot",
				},
			});
			return;
		}
		else {
			if (!this.first) {
				this.firstUserId = data.userId;
				this.first = true;
			} else if (this.first) {
				this.room = 'room' + this.i;
				const game = await this.gameService.createGame({
					player_one_id: this.firstUserId,
					player_two_id: data.userId,
					player_one_score: 0,
					player_two_score: 0,
					id_winer: -1,
					status: 'playing',
					createdAt: new Date(),
				});
				if (!game) {
					console.log('errro game');
				}
				const user1 = await this.gameService.getUserById(this.firstUserId);
				const user2 = await this.gameService.getUserById(data.userId);
				this.wss.emit('start_game', {
					gameInfo: {
						id: game?.id,
						room: this.room,
						players: [user1, user2],
						gameMode: "Multiplayer",
					},
				});
				this.firstUserId = -1;
				this.first = false;
				this.i++;
			}
		}
	}
}

