import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

	constructor(private jwtService : JwtService) {

	}
 
	async generateAccessToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '60s'});
	}

	async generateRereshToken(payload : any) {
		return await this.jwtService.signAsync(payload, {expiresIn : '15d'});
	}

}