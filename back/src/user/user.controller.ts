import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/ft.guard';

@Controller('user')
export class UserController {

	@UseGuards(JwtGuard)
	@Get('profile')
	getProfile() {

		console.log("here");
		return ({
			given_name : 'Bob',
			last_name : 'Marley',
			username : 'Bmarley',
		});

	}

}