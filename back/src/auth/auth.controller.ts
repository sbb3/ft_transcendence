import { Controller, Get, UseGuards, Req, UnauthorizedException, Res,
	Post, Body, BadRequestException, Delete, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/jwt.guard';
import { Response, Request } from 'express';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {

	constructor(
			private authService : AuthService,
			private prismaService : PrismaService
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
			await this.authService.initCookies(user, user, response);
			response.redirect('http://localhost:5173/profile');
			return ;
		}

		// Check if the user is registered (for the front-end to check if it should display the qrCode)
		const authToken = await this.authService.generateAuthToken(user);
		this.authService.initCookie('tr_auth_token', authToken, {maxAge : 10 * 60 * 1000, sameSite : 'none', secure : true, httpOnly : true}, response);
		response.redirect('http://localhost:5173/2fa');
		return ;
	}

	@Get('2fa')
	async getQrcode(@Req() request : Request) {
		const authToken = request.cookies['tr_auth_token'];
		const isValid = await this.authService.isTokenValid(authToken, jwtConstants.authSecret);
		
		if (!isValid)
			throw new UnauthorizedException();
	
		const payload = this.authService.decodeToken(authToken);
		const {username, lastName, name} =  payload;
		const user = await this.prismaService.findUser({username, lastName, name});

		return {qrCode : await this.authService.generateQrCode(user.authSecret, "Ft_Transcendence" + user.username)};
	}

	@Post('2fa/verification')
	async verifyCode(@Req() request : Request, @Body('verificationCode') code : string | undefined, @Res() response : Response) {

		const authToken = request.cookies['tr_auth_token'];
		const isValid = await this.authService.isTokenValid(authToken, jwtConstants.authSecret);
		const payload = this.authService.decodeToken(authToken);
		const {username, lastName, name} = payload;

		if (!isValid)
			throw new UnauthorizedException();

		const user = await this.prismaService.findUser({username, lastName, name});

		if (!user)
			throw new UnauthorizedException();
		const isCodeValid = this.authService.verifyTwoFaCode(code, user.authSecret);
		
		if (!isCodeValid)
			throw new UnauthorizedException();
		response.cookie('tr_auth_token', '', {expires: new Date(0), sameSite : 'none', secure : true});
		await this.authService.initCookies({username, lastName, name}, {username, lastName, name}, response);
		response.sendStatus(201);
	}

	@Post('refresh')
	async getNewAccessToken(@Req() req : Request, @Res() res : Response, @Body('grant_type') grant : string | undefined) {

		const refreshToken = req.cookies['tr_refresh_token'];

		if (!grant || grant != "refresh_token")
			throw new BadRequestException('Bad Grant Type');
		if (!await this.authService.isTokenValid(refreshToken, jwtConstants.rtSecret))
			throw new UnauthorizedException();

		const payload = this.authService.decodeToken(refreshToken);
		const {username, lastName, name} = payload;
		const newAccessToken = await this.authService.generateAccessToken({username, lastName, name});

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