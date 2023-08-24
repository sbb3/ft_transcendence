import { Injectable, Response, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthService {

	constructor(private jwtService : JwtService) {

	}

	async generateAccessToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '30m', secret : jwtConstants.atSecret});
	}

	async generateRereshToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '15d', secret : jwtConstants.rtSecret});
	}

	async initCookies(accessPayload : any, refreshPayload : any, @Response() resp : any) {
	
		const accessToken = await this.generateAccessToken(accessPayload);
		const refreshToken = await this.generateRereshToken(refreshPayload);

		this.initCookie('tr_access_token', accessToken, {maxAge : 15 * 60 * 1000, sameSite : 'none', secure : true}, resp); // 90 seconds 
		this.initCookie('tr_refresh_token', refreshToken, {
		    maxAge: 24 * 16 * 60 * 60 * 1000, // 16 days
			httpOnly : true, 
			secure : true,
			sameSite : 'none'
		}, resp);

	}

	async isRefreshTokenValid(token : string) : Promise<any> {

		try {
			const payload = await this.jwtService.verifyAsync(token, { secret :jwtConstants.rtSecret });

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
}