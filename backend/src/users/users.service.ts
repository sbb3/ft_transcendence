import {
  Controller,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Cloudinary } from '@cloudinary/url-gen';
import { Request } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaClient } from '@prisma/client';
const cld = new Cloudinary({ cloud: { cloudName: 'dtsihtgwx' } });

@Injectable()
export class UsersService extends PrismaClient {
  // cloudinaryService: any;
  // prisma: any;
  websocketService: any;
  // constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(Controller.name);

  constructor(
    private cloudinaryService: CloudinaryService,
  ) {
    super();
  }
  isUserExist = (user: User | null): user is User => {
    return user !== null;
  };

  async findAllUsers() {
    const users = await this.user.findMany();
    return users;
  }

  async findOneById(id: string) {
    const user = await this.user.findUnique({
      where: { id: parseInt(id, 10) }, // Assuming your ID is an integer
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found by username');
    }
    return user;
  }

  async findByEmail(emails: string) {
    const user = await this.user.findUnique({
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
    await this.user.update({
      where: { id: parseInt(userId.toString(), 10) },
      data: {
        username: username,
        avatar: avatarUrl,
      },
    });
  }

  async getCurrentUser(userId: number) {
    try {
      const user = await this.user.findUnique({
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
  async getFriends(userId: number) {
    const user = await this.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const friendsIds = user.friends;
    const friends = await this.user.findMany({
      where: {
        id: {
          in: friendsIds,
        },
      },
    });
    return friends;
  }

  async addFriend(_id: number, _friendId: number) {
    const id = parseInt(_id.toString(), 10);
    const friendId = parseInt(_friendId.toString(), 10);

    const user = await this.user.findUnique({
      where: { id },
    });
    const friend = await this.user.findUnique({
      where: { id: friendId },
    });
    if (!user || !friend) {
      throw new NotFoundException(`User or friend not found`);
    }

    const currentUser = await this.user.update({
      where: { id },
      data: {
        friends: [...user.friends, friendId],
      },
    });
    await this.user.update({
      where: { id: friendId },
      data: {
        friends: [...friend.friends, id],
      },
    });
    // TODO: emit event to friend in order to update his friends list
    // this.websocketService.emit('friend_accepted', {
    //   id: friendId,
    //   userId: id,
    // });
    return currentUser;
  }
  async deleteFriend(id: number, friendId: number) {
    const user = await this.user.findUnique({
      where: { id },
    });
    const friend = await this.user.findUnique({
      where: { id: friendId },
    });
    if (!user || !friend) {
      throw new NotFoundException(`User or friend not found`);
    }

    const currentUser = await this.user.update({
      where: { id },
      data: {
        friends: user.friends.filter((id) => id !== friendId),
      },
    });
    await this.user.update({
      where: { id: friendId },
      data: {
        friends: friend.friends.filter((id) => id !== id),
      },
    });

    return currentUser;
  }
}
