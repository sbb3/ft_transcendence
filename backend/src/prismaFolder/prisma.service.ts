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
}