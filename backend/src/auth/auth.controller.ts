import { Controller, Get, UseGuards, Req, UnauthorizedException, Res,
	Post, Body, BadRequestException, Delete, NotFoundException, Put, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/ft.guard';
import { Request, response, Response } from 'express';
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

	@Post('otp-disable')
	async disableOtp(@Body('id', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			await this.authService.updateUserData({id : userId}, {is_otp_enabled : false});

			return response.json({ otp_disabled : true });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('profile-check-completed')
	async updateProfileCheck(@Body('id', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			await this.authService.updateUserData({id : userId}, {is_profile_completed : true});

			return response.json({message : 'is_profile_completed has been set to true'});
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('otp-uncheck-validated')
	async updateOtpValidated(@Body('id', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			await this.authService.updateUserData({id : userId}, {is_otp_validated : false})

			return response.json({message : 'is_otp_validated has been set to false'})
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('otp-generate')
	async generateOtpSecret(@Body('id', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			const user = await this.authService.findUser({id : userId});
			const secret = this.authService.generateOtpSecret();
			const otpURL = this.authService.generateOtpUrl(secret, user.username);
			await this.authService.updateUserData({id : userId}, {otp_secret : secret});

			return response.json({ otpAuthUrl : otpURL });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('otp-verify')
	async verifyOtp(@Body('id', ParseIntPipe) userId : number,
		@Body('pin') userPin : string, @Res() response : Response) {
		try {
			const user = await this.authService.findUser({id : userId});
			const isValid = this.authService.verifyTwoFaCode(userPin, user.otp_secret);

			if (isValid)
			{
				await this.authService.updateUserData({id : userId}, {is_otp_enabled : true});
				return response.json({ verified : true });
			}
			return response.status(403).json({ verified : false });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	@Post('otp-validate')
	async validateOtp(@Body('id', ParseIntPipe) userId : number,
		@Body('pin') userPin : string, @Res() response : Response) {
		try {
			const user = await this.authService.findUser({id : userId});
			const isValid = this.authService.verifyTwoFaCode(userPin, user.otp_secret);

			if (isValid)
			{
				await this.authService.updateUserData({id : userId}, {is_otp_validated : true});
				return response.json({ validated : true });
			}
			return response.status(403).json({ validated : false });
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

}