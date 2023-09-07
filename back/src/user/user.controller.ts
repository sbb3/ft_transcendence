import { Controller, Get, NotFoundException, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

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

	@UseGuards(JwtGuard)
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
	async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() request : Request) {
		const {name, username} = request['user'];
		const imageUrl = 'http://localhost:3000/user/image/' + file.filename;

		const user = await this.prismaService.updateUserData({name, username}, {profileImage : imageUrl});
		if (!user)
			throw new NotFoundException();
		return ;
	}

	@Get('image/:imageName')
	giveImage(@Param('imageName') imageName : string, @Res() response : any) {
		const path = './uploads/' + imageName;

		if (!fs.existsSync(path))
			throw new NotFoundException();
		return response.sendFile('./uploads/' + imageName, {root : './'});
	}

}