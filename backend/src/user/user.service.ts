import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { user, Prisma } from '@prisma/client';

@Injectable()
export class UserService extends PrismaClient {
    
    async findUser(id_user: number): Promise<user> {
        return await this.user.findUnique({
            where: {
                id: id_user,
              },
        });
    }
   
    async createUser(data: Prisma.userCreateInput): Promise<user> {
        return await this.user.create({
            data,
        });
    }
}
