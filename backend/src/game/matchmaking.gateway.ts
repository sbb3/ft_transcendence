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

// import path from 'path';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
// import { UsersService } from 'src/users/users.service';
// import { Paddle, Ball, Gol, canvaState } from './game.interface';
// import { getIdGame } from './game.update';
import { PrismaClient } from '@prisma/client';
// import { random } from 'lodash';

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
	// gameTable: { player_one_id: number; palyer_two_id: any; player_one_score: number; player_two_score: number; status: string; created_at: Date; };
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




	@SubscribeMessage('join_queue')
	async initMyPa(client: Socket, data) {
		// console.log(`id of the game : ${game?.id}`);
		console.log('id of the first user ', this.i);
		console.log(`incoming data from frontend : ${client?.id}, ${JSON.stringify(data)}`);
		if (data.gameType == 'bot') {
			// TODO: handle game mode
			this.wss.emit('start_game', {
				data: {
					id: this.id,
					gameType: 'bot',
					mode: data?.gameMode,
				},
			});
			return;
		}
		console.log(`first : ${this.first}`);

		// && await this.gameService.getUserStatus(data.userId) == 'online'

		// let randomNum = -1;
		if (!this.first) {
			// randomNum = random(0, 1000);
			// this.room = 'room' + this.i;
			this.firstUserId = data.userId;
			// client.join(this.room);
			this.first = true;
			//get the status of the user from the database

		} else if (this.first) {
			this.room = 'room' + this.i;
			// client.join(this.room);
			// const
			console.log(`room name for client : ${this.room}`);
			this.gameTable = {
				player_one_id: this.firstUserId,
				player_two_id: data.userId,
				id_winer: -1,
				player_one_score: 0,
				player_two_score: 0,
				status: 'playing',
				createdAt: new Date(),
			};
			// console.log(this.game);
			const game = await this.gameService.createGame(this.gameTable);
			if (!game) {
				console.log('errro game');
			}
			//use updateUser from game.controller.ts
			// this.gameService.updateUserGameStatus(data.id);
			// this.gameService.updateUserGameStatus(this.firstUserId);

			// }
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

