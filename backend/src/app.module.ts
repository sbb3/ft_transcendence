import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prismaFolder/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({
    isGlobal : true,
  }), ChatModule],
  controllers: [],
  providers: [ChatService],
})
export class AppModule {}
