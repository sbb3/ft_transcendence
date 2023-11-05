import { Injectable, NotFoundException, } from '@nestjs/common';
import { Prisma, game, PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService extends PrismaClient {
	constructor(
		private readonly userService: UsersService,) {
		super();
	}

	async createGame(data: Prisma.gameCreateInput) {
		// console.log("herererer");
		const game = await this.game.create({
			data,
		});
		if (!game) {
			console.log("errro lopez");
		}
		return game;
	}

	isUserExist = (game: game | null): game is game => {
		return game !== null;
	};

	async findOneById(id_game: string): Promise<game> {
		const game = await this.game.findUnique({
			where: { id: parseInt(id_game, 10) }
		})
		if (!game) {
			throw new NotFoundException(`Game with ID ${id_game} not found`);
		}
		return
	}

	async updatGameEnd(gameId: number, id_winer: number, status: string) {
		if (id_winer) {
			const game = await this.game.update({
				where: { id: gameId },
				data: {
					id_winer: id_winer,
					status: status,
				},
			})
			if (!game) {
				throw new NotFoundException(`Game with id ${gameId} not found`);
			}
		}
		const game = await this.game.findUnique({
			where: { id: gameId },
		});
		return game;
	}

	async updateUserGameStatus(userId: number, status: string) {
		const user = await this.userService.user.update({
			where: { id: userId },
			data: {
				status: status,
			},
		});

		if (!user) throw new NotFoundException();
		return user;
	}

	async updateUserIsWiner(userId: number) {
		console.log("QWEWQE");
		const user1 = await this.user.update({
			where: {
				id: userId
			},
			data: {
				WonGames: {
					increment: 1
				}
			}
		});

		return user1;
	}


	async updateUserIsLoser(userId: number) {
		const user1 = await this.user.update({
			where: {
				id: userId
			},
			data: {
				LostGames: {
					increment: 1
				}
			}
		});
		return user1;
	}

	async findAllGames() {
		return await this.game.findMany();
	}

	//get the user status from the database
	async getUserStatus(userId: number) {
		const user = await this.userService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(`User with id ${userId} not found`);
		}
		return user.status;
	}

	async getUserById(userId: number) {
		const user = await this.userService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(`User with id ${userId} not found`);
		}
		return user;
	}




}
