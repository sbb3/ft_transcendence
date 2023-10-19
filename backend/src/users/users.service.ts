import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class UsersService extends PrismaClient {
  constructor(private cloudinaryService: CloudinaryService) {
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
    avatar: Express.Multer.File,
  ) {
    if (!username && !avatar) {
      throw new HttpException(
        'You must provide either username or avatar',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (username) {
      const userWithUsername = await this.user.findUnique({
        where: { username },
      });
      if (userWithUsername) {
        throw new HttpException(
          'Username already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.user.update({
        where: { id: userId },
        data: {
          username,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
    if (avatar) {
      const rest = await this.cloudinaryService.uploadImage(avatar);
      const avatarUrl = rest.secure_url;
      const user = await this.user.update({
        where: { id: userId },
        data: {
          avatar: avatarUrl,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
    const user = await this.user.findUnique({
      where: { id: userId },
    });
    return user;
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
