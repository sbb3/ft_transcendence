import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/ft.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {

	constructor(private prismaService : PrismaService) { }

	@UseGuards(JwtGuard)
	@Get('profile')
	async getProfile(@Req() request : any) {

		const {name, lastName, username} = request.user;
		const user : any = await this.prismaService.findUser({name, lastName, username});

		return ({
			name : user.name,
			lastName : user.lastName,
			username : user.username,
			profileImage : user.profileImage,
		});

	}
}