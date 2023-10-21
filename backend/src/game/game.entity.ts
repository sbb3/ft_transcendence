import { Prisma, PrismaClient } from '@prisma/client';

// export class User {}

const prisma = new PrismaClient();

async function creatGame(data: Prisma.gameCreateInput) {
  const game = await prisma.game.create({
    data,
  });
  return game;
}

export class Game implements Prisma.gameCreateInput {
  id?: number;
  createdAt?: Date;
  player_one_id?: number;
  player_two_id?: number;
  player_one_score?: number;
  player_two_score?: number;
  status?: string;
  id_winer?: number;

  constructor(data: Game) {
	this.id = data.id;
	this.createdAt = data.createdAt;
	this.player_one_id = data.player_one_id;
	this.player_two_id = data.player_two_id;
	this.player_one_score = data.player_one_score;
	this.player_two_score = data.player_two_score;
	this.id_winer = data.id_winer;
  }
}