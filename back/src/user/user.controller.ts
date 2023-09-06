import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { request } from 'http';

@Controller('user')
export class UserController {

	constructor(private prismaService : PrismaService) { }

	@UseGuards(JwtGuard)
	@Get('profile')
	async getProfile(@Req() request : any) {

		const {name, username} = request.user;
		const user : any = await this.prismaService.findUser({name, username});

		return ({
			name : user.name,
			username : user.username,
			profileImage : user.profileImage,
		});
	}

	// @UseGuards(JwtGuard)
	@Post('upload')
	@UseInterceptors(FileInterceptor('file', {
		storage : diskStorage({
			destination : './uploads',
			filename : (req, file, cb) => {
				const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
				const extension = path.extname(file.originalname);
				cb(null, `${uniqueSuffix}${extension}`);
			}
		})
	}))
	uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() request : Request) {
		console.log(file)
		return file;
	}

}