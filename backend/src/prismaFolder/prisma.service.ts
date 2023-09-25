import { Injectable , OnModuleInit} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
	private readonly prisma: PrismaClient;
	constructor (private conf: ConfigService) {
		super ({
			datasources: {
			db: {
				url: conf.get("DATABASE_URL"),
			  },
			}
		})
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