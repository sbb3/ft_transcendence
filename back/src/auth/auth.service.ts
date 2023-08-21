import { Injectable, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthService {

	constructor(private jwtService : JwtService) {

	}

	async generateAccessToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '60s', secret : jwtConstants.atSecret});
	}

	async generateRereshToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '15d', secret : jwtConstants.rtSecret});
	}

	async initCookies(accessPayload : any, refreshPayload : any, @Response() resp : any) {
		
		const accessToken = await this.generateAccessToken(accessPayload);
		const refreshToken = await this.generateRereshToken(refreshPayload);

		resp.cookie('tr_access_token', accessToken); 
		resp.cookie('tr_refresh_token', refreshToken, {
			httpOnly : true, 
			secure : true
		});
	}
}