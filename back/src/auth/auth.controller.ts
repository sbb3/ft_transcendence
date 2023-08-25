import { Controller, Get, UseGuards, Req, UnauthorizedException, Res,
	Post, Body, BadRequestException, Delete, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/jwt.guard';
import { Response, Request } from 'express';
import { jwtConstants } from './auth.constants';

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

		const user = {
			username : userProfile.username,
			lastName : userProfile.familyName,
			name : userProfile.givenName,
		}

		const dbUser = await this.authService.createUserIfNotFound(user);

		if (!dbUser.isTwoFaEnabled)
		{
			await this.authService.initCookies(userProfile, userProfile, response);
			response.redirect('http://localhost:5173/profile');
			return ;
		}

		const authToken = await this.authService.generateAuthToken(user);

		this.authService.initCookie('tr_auth_token', authToken, {maxAge : 15 * 60 * 1000, sameSite : 'none', secure : true, httpOnly : true}, response);
		response.redirect('http://localhost:5173/2fa');
		//  check if the user has 2fa enabled, redirect to /2fa (front)
		//  fetch /qrcode and display
		//  checks the jwt token and then generate a qrcode and return it
		//  display it and make the user type the verification code (POST request)
		//  check if the code is right, then generate the access and refresh tokens and redirect to profile

		return ;
	}

	@Get('2fa')
	async getQrcode(@Req() request : Request) {
		const authToken = request.cookies['tr_auth_token'];
		const isValid = await this.authService.isTokenValid(authToken, jwtConstants.authSecret);

		if (!isValid)
			throw new UnauthorizedException();

		return 'qr_code_here';
	}

	@Post('refresh')
	async getNewAccessToken(@Req() req : Request, @Res() res : Response, @Body('grant_type') grant : string | undefined) {

		const refreshToken = req.cookies['tr_refresh_token'];

		if (!grant || grant != "refresh_token")
			throw new BadRequestException('Bad Grant Type');
		if (!await this.authService.isTokenValid(refreshToken, jwtConstants.rtSecret))
			throw new UnauthorizedException();

		const payload = this.authService.decodeToken(refreshToken);
		const {id, username, familyName, givenName} = payload;
	
		const newAccessToken = await this.authService.generateAccessToken({id, username, familyName, givenName});

		this.authService.initCookie('tr_access_token', newAccessToken, {maxAge :  15 * 60 * 1000, sameSite : 'none', secure : true}, res);

		res.status(201).json( { access_token : newAccessToken } );
	}

	@Delete('logout')
	logout(@Req() request : Request, @Res() response : Response) {

		if (!request.cookies['tr_access_token'] && !request.cookies['tr_refresh_token'])
			throw new NotFoundException();
		response.cookie('tr_access_token', '', {expires: new Date(0), sameSite : 'none', secure : true});
		response.cookie('tr_refresh_token', '', {expires: new Date(0), sameSite : 'none', secure : true});
		response.sendStatus(200);
	}
	
	// Not to forget blacklist tokens functionnality
	// Check samesite options

}