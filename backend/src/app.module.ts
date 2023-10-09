import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameGateway } from './game/game.gateway';
import { GameModule } from './game/game.module';


@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({
    isGlobal : true,
  }), GameModule],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule {}
