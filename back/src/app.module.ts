import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [AppService, ChatService],
})
export class AppModule {}
