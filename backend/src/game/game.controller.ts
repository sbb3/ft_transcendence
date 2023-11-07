import { Body, Controller, Get, Param, Post, Logger, BadRequestException, } from '@nestjs/common';
import { user, Prisma } from '@prisma/client';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { }
	// constructor(private gameService: GameService) {}


	private readonly logger = new Logger(Controller.name);


	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.gameService.findOneById(id);
	}

	@Get()
	findAll() {
		this.logger.log('\nfind all users\n');
		return this.gameService.findAllGames();
	}

	@Post()
	updateUser(@Param('userid') userid: number, status: string) {
		this.gameService.updateUserGameStatus(userid, status);
	}


	@Post()
	async creat(@Body() body: Prisma.gameCreateInput) {
		return this.gameService.createGame(body);
	}
}
