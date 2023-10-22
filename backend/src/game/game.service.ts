// import { Injectable , NotFoundException,} from '@nestjs/common';
// import { Prisma, game } from '@prisma/client';
// import { PrismaClient } from '@prisma/client';
// import { Game } from './game.entity';

// const prisma = new PrismaClient();
// @Injectable()
// export class GameService extends PrismaClient{

// 	isUserExist = (game: Game | null): game is Game => {
// 		return game !== null;
// 	  };

// 	async findOneById(id_game: string): Promise<game> {
// 	const game = await this.game.findUnique({
// 		where: {id : parseInt(id_game, 10)}
// 	})
// 	if (!game) {
// 		throw new NotFoundException(`Game with ID ${id_game} not found`);
// 	}
//     return
//   }

//   async updatGameEnd(gameId: number, id_winer: number, status: string) {
// 	if (id_winer) {
// 		const game = await this.game.update({
// 			where: { id : gameId},
// 			data: {
// 				id_winer: id_winer,
// 				status: status,
// 			},
// 		})
// 		if (!game) {
// 			throw new NotFoundException(`Game with id ${gameId} not found`);
// 		}
// 	}
// 	const game = await this.game.findUnique({
// 		where: {id: gameId},
// 	});
// 	return game;
//   }

//   async findAllGames() {
//     const games = await this.game.findMany();
//     return games;
//   }

// }
