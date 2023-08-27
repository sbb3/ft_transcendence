import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/ft.guard';

@Controller('user')
export class UserController {
	@UseGuards(JwtGuard)
	@Get('profile')
	getProfile(@Req() request : any) {

		console.log("Here : " + request.user);

		return ({
			given_name : request.user.name,
			last_name : request.user.lastName,
			username : request.user.username,
		});
	}
}