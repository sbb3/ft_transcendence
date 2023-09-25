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

    async createUser(userData : any) {
        return await this.user.create({data : userData});
    }

    async updateUserData(whichUser : any, whichData : any) {
        return await this.user.update({
            where : whichUser, 
            data : whichData
        });
    }
}