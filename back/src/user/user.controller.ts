import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {

    @Get('profile')
    @UseGuards(AuthGuard)
    getProfile() {

        return ({
            given_name : 'Bob',
            last_name : 'Marley',
            username : 'Bmarley'
        });
    }

}