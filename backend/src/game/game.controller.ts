// import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { user, Prisma } from '@prisma/client';
// import { GameService } from './game.service';

// @Controller('game')
// export class GameController {
//   constructor(private readonly gameService: GameService) {}
//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.gameService.findOne(id);
//   }

//   @Post()
//   async creat(@Body() body: Prisma.gameCreateInput) {
//     return this.gameService.create(body);
//   }
// }
