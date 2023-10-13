import {
  Injectable,
  NotFoundException,
  Res,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { PrismaService } from 'src/prismaFolder/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      secret: jwtConstants.atSecret,
    });
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      secret: jwtConstants.rtSecret,
    });
  }

  async isTokenValid(token: string, secretKey: string): Promise<any> {
    try {
      await this.jwtService.verifyAsync(token, { secret: secretKey });
      return;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async createUserIfNotFound(user: any): Promise<any> {
    let dbUser = await this.prismaService.findUser(user);

    if (!dbUser) dbUser = await this.prismaService.createUser(user);
    return dbUser;
  }

  async updateUserData(whichUser: any, toUpdate: any) {
    const user = await this.prismaService.updateUserData(whichUser, toUpdate);

    if (!user) throw new NotFoundException();
    return user;
  }

  initCookie(
    key: string,
    value: string,
    parameters: any,
    @Response() resp: any,
  ) {
    resp.cookie(key, value, parameters);
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  removeCookie(@Res() response: any, cookieName: string, params: any) {
    response.cookie(cookieName, '', params);
  }
}
