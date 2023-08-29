import { Controller, Get, UseGuards, Req, UnauthorizedException, Res,
	Post, Body, BadRequestException, Delete, NotFoundException, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/jwt.guard';
import { Request, Response } from 'express';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from './guards/ft.guard';
import { GoogleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {

	constructor(
			private authService : AuthService,
			private prismaService : PrismaService
		) { }

	@Get('google/oauth2')
	@UseGuards(GoogleGuard)
	initGoogleAuth() {

	}

	@Get('google/signin')
	@UseGuards(GoogleGuard)
	async googleSignIn(@Req() req : any, @Res() response : Response) {
		const allInfos = req.user;
		const {name, username} = req.user;
		const userProfile = {name, username};

		if (!userProfile)
			throw new UnauthorizedException();
		const dbUser = await this.authService.createUserIfNotFound(allInfos);

		if (!dbUser.isTwoFaEnabled)
		{
			await this.authService.initCookies(userProfile, userProfile, response);
			response.redirect('http://localhost:5173/profile');
			return ;
		}
		// Check if the userProfile is registered (for the front-end to check if it should display the qrCode)
		const authToken = await this.authService.generateAuthToken(userProfile);
		this.authService.initCookie('tr_auth_token', authToken, {maxAge : 5 * 60 * 1000, sameSite : 'none', secure : true, httpOnly : true}, response);
		return response.redirect('http://localhost:5173/2fa');
	}

	@Get('42/oauth2')
	@UseGuards(FtGuard)
	initOauth() {

	}

	@Get('signin')
	@UseGuards(FtGuard)
	async generateTokens(@Req() req : any, @Res() response : Response) {
		const allInfos = req.user;
		const {name, username} = req.user;
		const userProfile = {name, username};

		if (!userProfile)
			throw new UnauthorizedException();
		const dbUser = await this.authService.createUserIfNotFound(allInfos);

		if (!dbUser.isTwoFaEnabled)
		{
			await this.authService.initCookies(userProfile, userProfile, response);
			response.redirect('http://localhost:5173/profile');
			return ;
		}
		// Check if the userProfile is registered (for the front-end to check if it should display the qrCode)
		const authToken = await this.authService.generateAuthToken(userProfile);
		this.authService.initCookie('tr_auth_token', authToken, {maxAge : 5 * 60 * 1000, sameSite : 'none', secure : true, httpOnly : true}, response);
		return response.redirect('http://localhost:5173/2fa');
	}

	@Get('2fa')
	async getQrcode(@Req() request : Request) {
		const authToken = request.cookies['tr_auth_token'];
		const isValid = await this.authService.isTokenValid(authToken, jwtConstants.authSecret);
		
		if (!isValid)
			throw new UnauthorizedException();
	
		const payload = this.authService.decodeToken(authToken);
		const {username, name} =  payload;
		const user = await this.prismaService.findUser({username, name});

		return {qrCode : await this.authService.generateQrCode(user.authSecret, "Ft_" + user.username)};
	}

	@Post('2fa/verification')
	async verifyCode(@Req() request : Request, @Body('verificationCode') code : string | undefined, @Res() response : Response) {

		const authToken = request.cookies['tr_auth_token'];
		const isValid = await this.authService.isTokenValid(authToken, jwtConstants.authSecret);

		if (!isValid)
			throw new UnauthorizedException();

		const payload = this.authService.decodeToken(authToken);
		const {username, name} = payload;
		const user = await this.prismaService.findUser({username, name});

		if (!user)
			throw new UnauthorizedException();
		const isCodeValid = this.authService.verifyTwoFaCode(code, user.authSecret);

		if (!isCodeValid)
			throw new UnauthorizedException();

		this.authService.removeCookie(response, 'tr_auth_token', {expires: new Date(0), sameSite : 'none', secure : true});
		await this.authService.initCookies({username, name}, {username, name}, response);
		return response.sendStatus(201);
	}

	@Post('refresh')
	async getNewAccessToken(@Req() req : Request, @Res() res : Response, @Body('grant_type') grant : string | undefined) {

		const refreshToken = req.cookies['tr_refresh_token'];

		if (!grant || grant != "refresh_token")
			throw new BadRequestException('Bad Grant Type');
		if (!await this.authService.isTokenValid(refreshToken, jwtConstants.rtSecret))
			throw new UnauthorizedException();

		const payload = this.authService.decodeToken(refreshToken);
		const {username, name} = payload;
		const newAccessToken = await this.authService.generateAccessToken({username, name});

		this.authService.initCookie('tr_access_token', newAccessToken, {maxAge :  15 * 60 * 1000, sameSite : 'none', secure : true}, res);

		res.status(201).json( { access_token : newAccessToken } );
	}

	@Delete('logout')
	@UseGuards(JwtGuard)
	logout(@Req() request : Request, @Res() response : Response) {

		if (!request.cookies['tr_access_token'] && !request.cookies['tr_refresh_token'])
			throw new NotFoundException();
		this.authService.removeCookie(response, 'tr_access_token', {expires: new Date(0), sameSite : 'none', secure : true});
		this.authService.removeCookie(response, 'tr_refresh_token', {expires: new Date(0), sameSite : 'none', secure : true});
		response.sendStatus(200);
	}

	// Should not forget the jwt guard
	@Put('twoFactorAuthStatus')
	@UseGuards(JwtGuard)
	async enableTwoFA(@Req() request : any, @Body('isTwoFaEnabled') value : any, @Res() response : any) {
		const {name, username} = request.user;

		if (typeof value !== 'boolean')
			throw new BadRequestException();

		const twoFaSecret = value ? this.authService.generateTwoFaSecret() : null;
		const user = await this.authService.updateUserData({name, username}, {
			isTwoFaEnabled : value,
			authSecret : twoFaSecret,
		});

		if (!user)
			return response.sendStatus(404);
		if (value)
		{
			this.authService.removeCookie(response, 'tr_access_token', {expires: new Date(0), sameSite : 'none', secure : true});
			this.authService.removeCookie(response, 'tr_refresh_token', {expires: new Date(0), sameSite : 'none', secure : true});
			return response.sendStatus(200);
		}
		return response.sendStatus(200);
	}
	// Not to forget the blacklist tokens functionnality for security purposes
}