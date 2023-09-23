import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({
    isGlobal : true,
  }), ChatModule],
  controllers: [AppController],
  providers: [AppService, ChatService],
})
export class AppModule {}
