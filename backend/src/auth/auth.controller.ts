import { Controller, Get, UseGuards, Req, UnauthorizedException, Res,
	Post, 
	Body,
	ParseIntPipe} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/ft.guard';
import { Request, Response } from 'express';
import { jwtConstants } from './auth.constants';
import { JwtGuard } from './guards/jwt.guard';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { userIdDto } from 'src/user/dto/creatuserDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

	constructor(
			private authService : AuthService,
	) { }

	@ApiOperation({summary : "Initialize the 42 intra authentication process and set \'status\' to \'online\'"})
	@Get('login')
	@UseGuards(FtGuard)
	initOauth(@Req() request : Request) {
	}

	@ApiExcludeEndpoint()
	@Get('signin')
	@UseGuards(FtGuard)
	async generateTokens(@Req() req : any, @Res() response : Response) {
		this.signInLogic(req, response);
	}

	@ApiOperation({summary : "Get a new access token."})
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
	@ApiOperation({summary : "Delete jwt tokens and set \'status\' to \'offline\'"})
	@ApiBody({type : userIdDto})
	@UseGuards(JwtGuard)
	async logout(@Req() request : Request, @Res() response : Response, @Body('userId', ParseIntPipe) userId : number) {
		try {
			await this.authService.updateUserData({id : userId}, {
				is_otp_validated : false,
				status : 'offline',
			})

			if (request?.cookies?.refresh_token)
				this.authService.removeCookie(response, 'refresh_token', {expires: new Date(0), sameSite : 'none', secure : true});
			return response.json({is_otp_validated : false});
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}

	private async signInLogic(request : any, response : Response) {
		try {
			if (!request.user)
				throw new UnauthorizedException();
			const allInfos = request.user;
			allInfos.status = 'online';
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
}