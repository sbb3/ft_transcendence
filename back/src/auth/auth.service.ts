import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

	constructor(private jwtService : JwtService) {

	}

	async generateAccessToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '1d'});
	}

	async generateRereshToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '15d'});
	}

	giveToken(authorizationHeader : string) {

		console.log(authorizationHeader)
		return 'test';
	}

}