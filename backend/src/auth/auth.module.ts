import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FtStrategy } from './strategies/ft.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports : [
		PassportModule.register({ defaultStrategy : '42'}),
		JwtModule.register({
			global : true,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, FtStrategy, JwtStrategy]
})

export class AuthModule {}