import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
// import { GameService } from './game.service';
import { UsersModule } from 'src/users/users.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';

@Module({
	controllers: [GameController],
	providers: [GameGateway, MatchmakingGateway, GameService],
	imports: [UsersModule],
	// exports: [GameService],
})
export class GameModule { }
