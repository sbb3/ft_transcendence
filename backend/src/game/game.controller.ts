import { Body, Controller, Get, Param, Post , Logger, BadRequestException,} from '@nestjs/common';
import { user, Prisma } from '@prisma/client';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}


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

  @Post(':id/:id_winer/:status')
  async updatGameEnd(@Param('id') gameId: number, @Param('id_winer') id_winer: number, @Param('status') status: string)
  {
	try {
		const game = await this.gameService.updatGameEnd(gameId, id_winer, status);
		return game;
	}
	catch (error) {
		throw new BadRequestException(error.message);
	}
  }

//   @Post()
//   async creat(@Body() body: Prisma.gameCreateInput) {
//     return this.gameService.create(body);
//   }
}
