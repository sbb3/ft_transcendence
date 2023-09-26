import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController extends PrismaClient {

    constructor (private readonly userService: UserService){
        super();
    }

    @Get('profile/:id')
    async findOne(@Param('id') id: number){
        return await this.userService.findUser(id);
    }

    // @Post()
    // async create(@Body() body: Prisma.userCreateInput) {
    //     return this.userService.create(body);
    // }

    @Get('profile')
    @UseGuards(JwtGuard)
    async getProfile(@Req() request : any) {
        const {name, username} = request.user;
        
        return await this.user.findUnique({
            where : {
                name,
                username,
            }
        });
    }
}