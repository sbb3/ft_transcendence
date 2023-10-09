import { Injectable } from '@nestjs/common';
import { CreatUserDto } from './dto/creatuserDto';
// import { AppService } from '../app.service';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { PrismaClient } from '@prisma/client';
import { user, Prisma } from '@prisma/client';


const prisma = new PrismaClient();
@Injectable()
export class UserService {
    
    findOne(id_user: number): Promise<user> {
        return prisma.user.findUnique({
            where: {
                id: id_user,
              },
        });
    }
   
    async create(data: Prisma.userCreateInput): Promise<user> {
        return await prisma.user.create({
            data,
        });
    }

    
}
