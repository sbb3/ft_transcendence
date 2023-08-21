import { Controller, Get, UseGuards, Request, Response, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
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
		// Check if the user already exists
		await this.authService.initCookies(userProfile, { username : userProfile.username}, response);
	
		response.redirect('http://localhost:5173/profile');
	}
}