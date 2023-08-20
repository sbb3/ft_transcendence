import { Controller, Get, Header, Headers, Options, Request } from '@nestjs/common';

@Controller('user')
export class UserController {

    @Get('profile')
    @Header('Access-Control-Allow-Origin', 'http://localhost:5173')
    @Header('Access-Control-Allow-Credentials', 'true')
    getProfile(@Request() request) {

        console.log("Hello from the back-end");

        return ({
            given_name : 'Bob',
            last_name : 'Marley',
            username : 'Bmarley'
        });
    }

    @Options('profile')
    @Header('Access-Control-Allow-Origin', 'http://localhost:5173')
    @Header('Access-Control-Allow-Credentials', 'true')
    @Header('Access-Control-Allow-Headers', 'authorization')
    @Header('Access-Control-Allow-Methods', 'GET') // I can remove it
    preflightRequest(@Headers('Access-Control-Request-Headers') h) {
        
    }
}