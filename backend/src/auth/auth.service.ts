import { Injectable, NotFoundException, Res, Response, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/prismaFolder/prisma.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

	constructor(
		private jwtService : JwtService,
		private prismaService : PrismaService,
		) { }

	async generateAccessToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '30m', secret : jwtConstants.atSecret});
	}

	async generateRefreshToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '15d', secret : jwtConstants.rtSecret});
	}

	async generateAuthToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '5m', secret : jwtConstants.authSecret});
	}

	async initCookies(accessPayload : any, refreshPayload : any, @Response() resp : any) {
	
		const accessToken = await this.generateAccessToken(accessPayload);
		const refreshToken = await this.generateRefreshToken(refreshPayload);

		this.initCookie('tr_access_token', accessToken, {maxAge : 30 * 60 * 1000, sameSite : 'none', secure : true}, resp); // 31 minutes 
		this.initCookie('tr_refresh_token', refreshToken, {
			maxAge: 24 * 15 * 60 * 60 * 1000, // 15 days
			httpOnly : true,
			secure : true,
			sameSite : 'none'
		}, resp);
	}

	async isTokenValid(token : string, secretKey : string) : Promise<any> {

		try {
			await this.jwtService.verifyAsync(token, { secret : secretKey });
			return ;
		}
		catch {
			throw new UnauthorizedException();
		}
	}
	async createUserIfNotFound(user : any) : Promise<any> {
	
		let dbUser = await this.prismaService.findUser(user);

		if (!dbUser)
			dbUser = await this.prismaService.createUser(user);
		return dbUser;
	}

	initCookie(key : string, value : string, parameters : any, @Response() resp : any) {
		resp.cookie(key, value, parameters);
	}

	decodeToken(token : string) : any {
		return this.jwtService.decode(token);
	}


	removeCookie(@Res() response : any, cookieName : string, params : any) {
		response.cookie(cookieName, '', params);
	}

	generateOtpSecret() : string {
		return authenticator.generateSecret();
	}

	generateOtpUrl(secret : string, account_name : string) : string {
		return authenticator.keyuri(account_name, "ft_Transcendence", secret);
	}

	verifyTwoFaCode(code : string, secret : string) {
		return authenticator.verify( {token : code, secret : secret} );
	}

	async findUser(data : any) {
		const user = await this.prismaService.findUser(data);

		if (!user)
			throw new NotFoundException();
		return user;
	}

	async updateUserData(whichUser : any, toUpdate : any) {
		const user = await this.prismaService.updateUserData(whichUser, toUpdate);

		if (!user)
			throw new NotFoundException();
		return user;
	}
}