import { Controller, Get, UseGuards, Req, UnauthorizedException, Res,
	Post, Body, BadRequestException, Delete, NotFoundException, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/ft.guard';
import { Request, Response } from 'express';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/prismaFolder/prisma.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('/api/auth')
export class AuthController {

	constructor(
			private authService : AuthService,
			private prismaService : PrismaService
	) { }

	@Get('login')
	@UseGuards(FtGuard)
	initOauth(@Req() request : Request) {
	}

	@Get('signin')
	@UseGuards(FtGuard)
	async generateTokens(@Req() req : any, @Res() response : Response) {
		this.signInLogic(req, response);
	}

	@Get('refresh')
	async getNewAccessToken(@Req() req : Request, @Res() res : Response) {
		try
		{
			const refreshToken = req?.cookies?.refresh_token;

			await this.authService.isTokenValid(refreshToken, jwtConstants.rtSecret);
			const payload = this.authService.decodeToken(refreshToken);
			const { id } = payload;
			const newAccessToken = await this.authService.generateAccessToken({id});
	
			return res.json( { accessToken : newAccessToken, user : { id } } );
		}
		catch (error) {
			return res.status(401).json(error);
		}
	}

	@Post('logout')
	@UseGuards(JwtGuard)
	logout(@Req() request : Request, @Res() response : Response) {
		if (request?.cookies?.refresh_token)
			this.authService.removeCookie(response, 'refresh_token', {expires: new Date(0), sameSite : 'none', secure : true});
		return response.sendStatus(200);
	}

	private async signInLogic(request : any, response : Response) {
		try {
			if (!request.user)
				throw new UnauthorizedException();
			const allInfos = request.user;
			const dbUser = await this.authService.createUserIfNotFound(allInfos);
			const profileId = dbUser.id;
			const refreshToken = await this.authService.generateRefreshToken({id : profileId});
	
			this.authService.initCookie('refresh_token', refreshToken, {
				maxAge: 24 * 15 * 60 * 60 * 1000, // 15 days
				httpOnly : true,
				secure : true,
				sameSite : 'none'
			}, response);

			return response.redirect(process.env.FRONT_URL + '');
		}
		catch (error) {
			return response.status(401).json(error);
		}
	}

	// Otp code here
	@Get('2fa')
	async getQrcode(@Req() request : Request, @Res() response : Response) {
		const authToken = request.cookies['tr_auth_token'];
		try {
			await this.authService.isTokenValid(authToken, jwtConstants.authSecret);
		}
		catch (error) {
			return response.status(401).json(error);
		}

		const payload = this.authService.decodeToken(authToken);
		const {username, name} =  payload;
		const user = await this.prismaService.findUser({username, name});

		return {qrCode : await this.authService.generateQrCode(user.otp_secret, "Ft_" + user.username)};
	}

	@Post('2fa/verification')
	async verifyCode(@Req() request : Request, @Body('verificationCode') code : string | undefined, @Res() response : Response) {

		const authToken = request.cookies['tr_auth_token'];
		try {
			await this.authService.isTokenValid(authToken, jwtConstants.authSecret);
		}
		catch (error) {
			response.status(401).json(error);
		}

		const payload = this.authService.decodeToken(authToken);
		const {username, name} = payload;
		const user = await this.prismaService.findUser({username, name});

		if (!user)
			throw new UnauthorizedException();
		const isCodeValid = this.authService.verifyTwoFaCode(code, user.otp_secret);

		if (!isCodeValid)
			throw new UnauthorizedException();

		this.authService.removeCookie(response, 'tr_auth_token', {expires: new Date(0), sameSite : 'none', secure : true});
		await this.authService.initCookies({username, name}, {username, name}, response);
		return response.sendStatus(201);
	}


	@Put('twoFactorAuthStatus')
	@UseGuards(JwtGuard)
	async enableTwoFA(@Req() request : any, @Body('isTwoFaEnabled') value : any, @Res() response : any) {
		const {name, username} = request.user;

		if (typeof value !== 'boolean')
			throw new BadRequestException();

		const twoFaSecret = value ? this.authService.generateTwoFaSecret() : null;
		const user = await this.authService.updateUserData({name, username}, {
			is_otp_enabled : value,
			otp_secret : twoFaSecret,
		});

		if (!user)
			return response.sendStatus(404);

		// Disconnecting the user here to make him relog but with otp validation this time
		if (value)
		{
			this.authService.removeCookie(response, 'refresh_token', {expires: new Date(0), sameSite : 'none', secure : true});
			return response.sendStatus(200);
		}
		return response.sendStatus(204);
	}
}