import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FtStrategy } from './auth.strategy';

@Controller('auth')
export class AuthController {

	constructor(private ftStrategy : FtStrategy) {

	}

	@Get('42/oauth2')
	@UseGuards(AuthGuard('42'))
	initOauth() {

	}

	@Get('signin')
	@UseGuards(AuthGuard('42'))
	test(@Request() req : any, @Response() resp) {
		// JWT logic here after validating the user

		resp.redirect('http://localhost:5173/profile');
	}
}