import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { user, Prisma } from '@prisma/client';

@Injectable()
export class UserService extends PrismaClient {
    
    findOne(id_user: number): Promise<user> {
        return this.user.findUnique({
            where: {
                id: id_user,
              },
        });
    }
   
    async create(data: Prisma.userCreateInput): Promise<user> {
        return await this.user.create({
            data,
        });
    }
}
