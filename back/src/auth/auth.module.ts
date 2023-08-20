import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FtStrategy } from './auth.strategy';
import { JwtModule } from '@nestjs/jwt';
// import { AuthGuard } from './auth.guard';

@Module({
	imports : [
		PassportModule.register({ defaultStrategy : '42'}),
		JwtModule.register({
			global : true,
			secret : 'test-secret', // Here I should use env or jwtConstants in a file
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, FtStrategy]
})

export class AuthModule {}