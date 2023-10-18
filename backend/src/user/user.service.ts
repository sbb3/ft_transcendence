import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService extends PrismaClient {
    
    constructor() {
        super();
    }

	async updateUserData(whichUser : any, toUpdate : any) {
		const user = await this.user.update({
			where : whichUser,
			data : toUpdate
		});

		if (!user)
			throw new NotFoundException();
		return user;
	}
}
