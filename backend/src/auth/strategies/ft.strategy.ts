import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {

    constructor() {
        super({
            clientID : 'u-s4t2ud-4da9199116507cc0d2f118d75d3e2db3e5863a948ac95c5ea28b57cea185afe5',
            clientSecret : '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',
            callbackURL : 'http://localhost:3000/auth/signin'
        });
    }

    async validate(access_token : string, refresh_token : string, profile : any) : Promise<any> {
        console.log(profile._json.email);
        return {
            username : profile.username,
            name : profile._json.first_name,
            avatar : profile._json.image.link,
            email : profile._json.email,
        };
	}

}