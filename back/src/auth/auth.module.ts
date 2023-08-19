import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FtStrategy } from './auth.strategy';

@Module({
	imports : [
		PassportModule.register({ defaultStrategy : '42'}),
	],
	controllers: [AuthController],
	providers: [AuthService, FtStrategy]
})

export class AuthModule {}