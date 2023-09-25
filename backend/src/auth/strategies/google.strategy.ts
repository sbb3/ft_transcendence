import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID : '906217645924-esg8738t1flpjf73eniis14iq7s2e0kk.apps.googleusercontent.com',
			clientSecret : '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',
			callbackURL : 'http://localhost:3000/auth/google/signin',
			scope : ['profile', 'email'],
        })
    }

	async validate(access_token : string, refresh_token : string, profile : Profile) {
		return { 
			name : profile._json.given_name,
			avatar : profile._json.picture,
			username : profile._json.email.split('@')[0],
			email : profile._json.email,
		 };
	}
}