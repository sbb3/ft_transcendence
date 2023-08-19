import { Controller, Get, UseGuards, Request, Response, Header, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FtStrategy } from './auth.strategy';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

	constructor(
		private ftStrategy : FtStrategy,
		private authService : AuthService,
		private jwtService : JwtService) {
	}

	@Get('42/oauth2')
	@UseGuards(AuthGuard('42'))
	initOauth() {

	}
	
	@Get('signin')
	@UseGuards(AuthGuard('42'))
	async generateTokens(@Request() req : any, @Response() resp) {
		const userProfile = req.user;
		const accessToken = await this.authService.generateAccessToken(userProfile);
		const refreshToken = await this.authService.generateRereshToken( { username : userProfile.username } );
		
		resp.cookie('access_token', accessToken);
		resp.cookie('refresh_token', refreshToken, {
			httpOnly : true,
			secure : true 
		});

		resp.redirect('http://localhost:5173/profile');
	}

	@Get('test')
	@Header('Access-Control-Allow-Origin', 'http://localhost:5173')
	getCookies(@Request() req) {

		return ({username : 'oess', name : 'test'});
	}
}