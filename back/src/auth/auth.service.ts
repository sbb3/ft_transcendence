import { Injectable, Response, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

	constructor(
		private jwtService : JwtService,
		private prismaService : PrismaService,
		) {

	}

	async generateAccessToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '30m', secret : jwtConstants.atSecret});
	}

	async generateRereshToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '15d', secret : jwtConstants.rtSecret});
	}

	async generateAuthToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '1d', secret : jwtConstants.authSecret});
	}

	async initCookies(accessPayload : any, refreshPayload : any, @Response() resp : any) {
	
		const accessToken = await this.generateAccessToken(accessPayload);
		const refreshToken = await this.generateRereshToken(refreshPayload);

		this.initCookie('tr_access_token', accessToken, {maxAge : 31 * 60 * 1000, sameSite : 'none', secure : true}, resp); // 31 minutes 
		this.initCookie('tr_refresh_token', refreshToken, {
			maxAge: 24 * 16 * 60 * 60 * 1000, // 16 days
			httpOnly : true,
			secure : true,
			sameSite : 'none'
		}, resp);
	}

	async isTokenValid(token : string, secretKey : string) : Promise<any> {

		try {
			const payload = await this.jwtService.verifyAsync(token, { secret : secretKey });

			return true;
		}
		catch {
			return false;
		}
	}

	initCookie(key : string, value : string, parameters : any, @Response() resp : any) {
		resp.cookie(key, value, parameters);
	}

	decodeToken(token : string) : any {
		return this.jwtService.decode(token);
	}

	async createUserIfNotFound(user : any) : Promise<any> {
	
		let dbUser = await this.prismaService.findUser(user);

		if (!dbUser)
		{
			user.authSecret = authenticator.generateSecret();
			dbUser = await this.prismaService.createUser(user);
		}
		return dbUser;
	}

	async generateQrCode(secret : string, account_name : string) : Promise<string> {
		const otpURL = authenticator.keyuri(account_name, "Ft_Transcendence", secret);
		
		return await toDataURL(otpURL);
	}

	verifyTwoFaCode(code : string | undefined, secret : string) {
		return authenticator.verify( {token : code, secret : secret} );
	}
}