import { Controller, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prismaFolder/prisma.service'; // Import your Prisma service
import { User } from './entities/user.entity';
import {Cloudinary} from "@cloudinary/url-gen";
import {Request} from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
const cld = new Cloudinary({cloud: {cloudName: 'dtsihtgwx'}});

@Injectable()
export class UsersService {
  // cloudinaryService: any;
  // prisma: any;
  // websocketService: any;
  // constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(Controller.name);

  constructor(
    private readonly prismaService: PrismaService,
    private PrismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  isUserExist = (user: User | null): user is User => {
		return user !== null;
	}
  
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
        throw new NotFoundException(`User with ID ${usernames} not found`);
      }
      return user;
  }
    
    
  async findByEmail(emails: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: emails,
      },
    });

    if (this.isUserExist(user))
			return user;
		else
			throw new NotFoundException('user not found');
  }




  async updateUserDetails(userId: number, username: string, file: Express.Multer.File): Promise<void> {
    this.logger.log('\nupdateUserDetails\n');
    console.log(`\n userId : ${userId} \n`);
    console.log(`\n username : ${username} \n`);
    // console.log(`\n filename : ${file.filename} \n`);
    console.log(`\n file : ${JSON.stringify(file.originalname)} \n`);
    console.log(`\n path  : ${JSON.stringify(file.path)} \n`);

    // const avatarUrl = await this.cloudinaryService.uploadImage(file);
    const rest = await this.cloudinaryService.uploadImage(file).catch(() => {
      throw new Error('Invalid file type.');
    });

    console.log(`\n rest : ${JSON.stringify(rest)} \n`);
    // this.logger.log(`\n avatarUrl : ${avatarUrl} \n`);
    this.logger.log(`\n username : ${username} \n`);
    await this.PrismaService.user.update({
      where: { id: userId },
      data: {
        username : username,
        // avatar: avatarUrl,
      },
    });
}

// async uploadImageToCloudinary(file: Express.Multer.File) {
//   return await this.cloudinaryService.uploadImage(file).catch(() => {
//     throw new Error('Invalid file type.');
//   });
// }


}

