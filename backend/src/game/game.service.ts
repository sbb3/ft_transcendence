// import { Injectable } from '@nestjs/common';
// import { Prisma, game } from '@prisma/client';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// @Injectable()
// export class GameService {
//   findOne(id_user: number): Promise<game> {
//     return prisma.game.findUnique({
//       where: {
//         id: id_user,
//       },
//     });
//   }

//   async create(data: Prisma.gameCreateInput): Promise<game> {
//     return await prisma.game.create({
//       data,
//     });
//   }
// }
