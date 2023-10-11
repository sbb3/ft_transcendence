import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prismaFolder/prisma.service';

@Injectable()
export class UserService extends PrismaClient {
    
    constructor(private prismaService : PrismaService) {
        super();
    }

	async updateUserData(whichUser : any, toUpdate : any) {
		const user = await this.prismaService.updateUserData(whichUser, toUpdate);

		if (!user)
			throw new NotFoundException();
		return user;
	}
}
