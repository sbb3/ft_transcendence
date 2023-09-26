import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prismaFolder/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ConfigModule.forRoot({
    isGlobal : true,
  }), ChatModule],
  controllers: [],
  providers: [ChatService],
})

export class AppModule {}