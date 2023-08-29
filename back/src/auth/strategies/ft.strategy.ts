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
        return {
            username : profile.username,
            name : profile.name.givenName,
            profileImage : profile._json.image.link,
        };
	}

}