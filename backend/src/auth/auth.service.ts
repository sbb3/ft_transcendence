import {
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateUsername } from "unique-username-generator";

@Injectable()
export class AuthService extends PrismaClient {
  constructor(private jwtService: JwtService) {
    super();
  }

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

  async isTokenValid(token: string, secretKey: string) {
    try {
      await this.jwtService.verifyAsync(token, { secret: secretKey });
      const decodedToken = this.decodeToken(token);
      const user = decodedToken?.id
        ? await this.user.findUnique({
            where: {
              id: decodedToken.id,
            },
          })
        : null;

      if (!user) throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }

  async createUserIfNotFound(user: any) {
    const dbUser = await this.user.findUnique({
      where: {
        email: user.email
      }
    });
    const dbUserPrime = await this.user.findUnique({
      where : {
          username: user.username,
      }
    });

    if (!dbUser && dbUserPrime)
      user.username = generateUsername();
    return !dbUser
      ? await this.user.create({
          data: user,
        })
      : dbUser;
  }

  async updateUserData(whichUser: any, toUpdate: any) {
    const user = await this.user.update({
      where: whichUser,
      data: toUpdate,
    });

    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  initCookie(key: string, value: string, parameters: any, @Res() resp: any) {
    resp.cookie(key, value, parameters);
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  removeCookie(@Res() response: Response, cookieName: string, params: any) {
    response.cookie(cookieName, '', params);
  }

  async signInLogic(request: Request, response: Response) {
    const allInfos = request['user'];
    allInfos.status = 'online';
    const dbUser = await this.createUserIfNotFound(allInfos);
    const refreshToken = await this.generateRefreshToken({ id: dbUser.id });
    this.initCookie(
      'refresh_token',
      refreshToken,
      {
        maxAge: 24 * 15 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      },
      response,
    );

    return response.redirect(process.env.FRONT_URL + '');
  }
}
