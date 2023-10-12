import {
  Controller,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prismaFolder/prisma.service'; // Import your Prisma service
import { User } from './entities/user.entity';
import { Cloudinary } from '@cloudinary/url-gen';
import { Request } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
const cld = new Cloudinary({ cloud: { cloudName: 'dtsihtgwx' } });

@Injectable()
export class UsersService {
  // cloudinaryService: any;
  // prisma: any;
  // websocketService: any;
  // constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(Controller.name);

  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  isUserExist = (user: User | null): user is User => {
    return user !== null;
  };

  async findAllUsers() {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async findOneById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: parseInt(id, 10) }, // Assuming your ID is an integer
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(usernames: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: usernames,
      },
    });

    if (!user) {
      throw new Error('user not found by username');
    }
    return user;
  }

  async findByEmail(emails: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: emails,
      },
    });

    if (this.isUserExist(user)) return user;
    else throw new NotFoundException('user not found');
  }

  async updateUserDetails(
    userId: number,
    username: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const rest = await this.cloudinaryService.uploadImage(file);
    const avatarUrl = rest.secure_url;
    await this.prismaService.user.update({
      where: { id: parseInt(userId.toString(), 10) },
      data: {
        username: username,
        avatar: avatarUrl,
      },
    });
  }

  async getCurrentUser(userId: number) {
    console.log(`userId: ${userId} `);
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: parseInt(userId.toString(), 10) },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}