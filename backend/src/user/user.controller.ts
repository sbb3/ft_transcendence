import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatUserDto } from './dto/creatuserDto';
import { UserService } from './user.service';
import { user as UserMode } from '@prisma/client';
import { user, Prisma } from '@prisma/client';
// import { get } from 'http';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService){}
    @Get(':id')
    findOne(@Param('id') id: number){
        return this.userService.findOne(id);
    }

    @Post()
    async creat(@Body() body: Prisma.userCreateInput) {
        return this.userService.create(body);
    }
    // @Post()
    // async signupUser(@Body() body: CreatUserDto): Promise<UserMode> {
    //   return this.userService.create(body);
    // }
}
