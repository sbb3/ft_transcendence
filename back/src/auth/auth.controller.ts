import { Controller, Get, UseGuards, Request, Response, Header, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FtStrategy } from './auth.strategy';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor(
			private ftStrategy : FtStrategy,
			private authService : AuthService,
		) { }
		
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
		
		resp.cookie('tr_access_token', accessToken);
		resp.cookie('tr_refresh_token', refreshToken, {
			httpOnly : true,
			secure : true 
		});

		resp.redirect('http://localhost:5173/');
	}
}