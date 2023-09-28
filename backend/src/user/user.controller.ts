import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController extends PrismaClient {

    constructor (private readonly userService: UserService){
        super();
    }
    
	@ApiOperation({ summary : 'Set \'is_profile_completed\' to true.' })
	@ApiParam({name : 'userId'})
	@Post('profile-check-completed')
	@UseGuards(JwtGuard)
	async updateProfileCheck(@Body('userId', ParseIntPipe) userId : number, @Res() response : Response) {
		try {
			await this.userService.updateUserData({id : userId}, {is_profile_completed : true});

			return response.json({message : 'is_profile_completed has been set to true'});
		}
		catch (error) {
			return response.status(404).json(error);
		}
	}
}