import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prismaFolder/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ConfigModule.forRoot({
    isGlobal : true,
  }), ChatModule, OtpModule],
  controllers: [],
  providers: [],
})

export class AppModule {}