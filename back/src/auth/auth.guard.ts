import { CanActivate, ExecutionContext, Header, Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Ip } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService : JwtService) {
		
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {

		const request = context.switchToHttp().getRequest();
		const [type, token] = request.headers.authorization?.split(' ');

		console.log(request.cookies);
		console.log('request ip : ' + request.ip);
		if (type != 'Bearer' || token === 'undefined')
			throw new UnauthorizedException();

		try {
			const payload = await this.jwtService.verifyAsync(token, { secret : 'test-secret'});

			console.log('here');
			console.log(payload);
			// Here check if the user exists 
			if (!payload)
				throw new UnauthorizedException();
		}
		catch (error) {
			console.log("here");
			throw new UnauthorizedException();
		}

		return true;
	}
}