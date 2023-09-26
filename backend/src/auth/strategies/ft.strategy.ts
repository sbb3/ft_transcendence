import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {

    constructor() {
        super({
            clientID : 'u-s4t2ud-19c356e0e36f930a07f4b4528042fa41834ad30363d6235be57413c6d0c79326',
            clientSecret : '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',
            callbackURL : 'http://localhost:3000/api/auth/signin'
        });
    }

    async validate(access_token : string, refresh_token : string, profile : any) : Promise<any> {
        console.log(profile._json.campus[0].name);
        return {
            username : profile.username,
            name : profile._json.first_name,
            avatar : profile._json.image.link,
            email : profile._json.email,
            campus : profile._json.campus[0].name,
        };
	}

}