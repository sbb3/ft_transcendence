import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService){}
    @Get(':id')
    findOne(@Param('id') id: number){
        return this.userService.findOne(id);
    }

    @Post()
    async create(@Body() body: Prisma.userCreateInput) {
        return this.userService.create(body);
    }

}
