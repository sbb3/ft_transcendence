import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ChannelsModule } from './channels/channels.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';
import { NotificationModule } from './notifications/notification.module';
import { NotificationGateway } from './notifications/notification.gateway';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    OtpModule,
    ChannelsModule,
    UsersModule,
    ChatGateway,
    NotificationModule,
    NotificationGateway,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
