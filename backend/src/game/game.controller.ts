import { Body, Controller, Get, Param, Post, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { }

	private readonly logger = new Logger(Controller.name);

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.gameService.findOneById(id);
	}

	@Get()
	findAll() {
		return this.gameService.findAllGames();
	}

	@Post()
	updateUser(@Param('userid') userid: number, status: string) {
		this.gameService.updateUserGameStatus(userid, status);
	}


	@Post()
	updateUserWiner(@Param('userid') userid: number) {
		this.gameService.updateUserIsWiner(userid);
	}


	@Post()
	async creat(@Body() body: Prisma.gameCreateInput) {
		return this.gameService.createGame(body);
	}
}
