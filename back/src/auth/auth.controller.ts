import { Controller, Get, UseGuards, Request, Response, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guards/ft.guard';
import { FtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {

	constructor(
			private authService : AuthService,
		) { }

	@UseGuards(FtGuard)
	@Get('42/oauth2')
	initOauth() {

	}
	
	@Get('signin')
	@UseGuards(FtGuard)
	async generateTokens(@Request() req : any, @Response() response : any) {

		const userProfile = req.user;
		
		if (!userProfile)
			throw new UnauthorizedException();

		// Here I should implement the database logic

		await this.authService.initCookies(userProfile, { username : userProfile.username}, response);
		response.redirect('http://localhost:5173/profile');
	}
}