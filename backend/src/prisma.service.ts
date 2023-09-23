import { Injectable , OnModuleInit} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

@Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//     async onModuleInit() {
//       await this.$connect();
//     }
//   }
export class PrismaService extends PrismaClient {
    private readonly prisma: PrismaClient;
    constructor (private conf: ConfigService) {
        
        super ({
            // this.prisma = new PrismaClient;
            datasources: {
            db: {
                url: conf.get("DATABASE_URL"), // Use an environment variable for the database URL
              },
            }
        })

    }

    // constructor (private readonly prisma: PrismaClient) {
    //     super ({
    //         app.db :db
    //         // app : db
    //     });
    // }
    // constructor (private readonly db: PrismaClient) {

    // }
    // constructor (private readonly ) {
    //     {
    //         db : db
    //     }
    // }
//   async onModuleInit() {
    
//     await this.$connect();
//   }
}