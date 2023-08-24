import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {

    constructor() {
        super();
    }

    async findUser(data : any) {
        return await this.user.findUnique({
            where : data
        });
    }

    async createUser(data : any) {
        return await this.user.create({data});
    }
}
