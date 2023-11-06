import { Logger, Injectable } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';


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
	queue = [];
	i: number = 0;
	room: string = 'room';

	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('GameGateway');

	handleConnection(client: Socket, ...args: any[]) {
	}

	handleDisconnect(client: Socket) {
		this.queue = this.queue.filter(client => client.socketId == client.id);
		this.logger.log(`Client disconnected looopez: ${client.id}`);
	}

	afterInit(server: Server) {
		this.logger.log('Initialized');
	}

	@SubscribeMessage('cancelMatchmaking')
	cancelMatchmaking(client: Socket) {
		this.queue = this.queue.filter(client => client.socketId == client.id);
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
			this.queue.push({
				id : data.userId,
				socketId : client.id
			});
			while (this.queue.length >= 2) {
				let newRoom = 'room' + this.i;
				let gameTable = {
					player_one_id: this.queue.shift().id,
					player_two_id: this.queue.shift().id,
					player_one_score: 0,
					player_two_score: 0,
					id_winer: -1,
					status: 'playing',
					createdAt: new Date(),
				};
				this.i++;
				// Should check if the game is created or not
				const game = await this.gameService.createGame(gameTable);
				const user1 = await this.gameService.getUserById(gameTable.player_one_id);
				const user2 = await this.gameService.getUserById(gameTable.player_two_id);
				this.wss.emit('start_game', {
					gameInfo: {
						id: game?.id,
						room: newRoom,
						players: [user1, user2],
						gameMode: "Multiplayer",
					},
				});
			}
		}
	}
}

