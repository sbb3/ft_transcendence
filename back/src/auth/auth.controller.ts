import { Controller, Get, UseGuards, Req, UnauthorizedException, Res, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/jwt.guard';
import { Response, Request } from 'express';

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
	async generateTokens(@Req() req : any, @Res() response : Response) {

		const userProfile = req.user;

		if (!userProfile)
			throw new UnauthorizedException();

		// Here I should implement the database logic
		// Check if the user already exists
		await this.authService.initCookies(userProfile, userProfile, response);
	
		response.redirect('http://localhost:5173/profile');
	}

	@Post('refresh')
	async getNewAccessToken(@Req() req : Request, @Res() res : Response, @Body('grant_type') grant : string | undefined) {

		const refreshToken = req.cookies['tr_refresh_token'];

		if (!grant || grant != "refresh_token")
			throw new BadRequestException('Bad Grant Type');
		if (!await this.authService.isRefreshTokenValid(refreshToken))
			throw new UnauthorizedException();

		const payload = this.authService.decodeToken(refreshToken);
		const {id, username, familyName, givenName} = payload;
	
		const newAccessToken = await this.authService.generateAccessToken({id, username, familyName, givenName});

		this.authService.initCookie('tr_access_token', newAccessToken, {maxAge :  90 * 1000, sameSite : 'none', secure : true}, res);

		res.status(201).json( { access_token : newAccessToken } );
	}
}