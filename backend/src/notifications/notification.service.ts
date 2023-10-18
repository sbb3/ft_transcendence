import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNotificationDto } from './dto/createNotificationDto';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from 'src/prismaFolder/prisma.service';

@Injectable()
export class NotificationService extends PrismaClient {
  constructor(
    private webSocketGateway: NotificationGateway,
    private prisma: PrismaService,
  ) {
    super();
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const sender = await this.user.findUnique({
      where: { id: createNotificationDto.senderId },
    });
    const receiver = await this.user.findUnique({
      where: { id: createNotificationDto.receiverId },
    });

    if (!sender || !receiver)
      throw new NotFoundException(
        !sender ? 'Sender not found.' : 'Receiver not found.',
      );

    // check if sender and receiver are friends, the friends array is in the user table
    if (sender.friends.includes(receiver.id)) {
      throw new BadRequestException(
        'You cannot send a friend request to an existing friend.',
      );
    }

    const newNotification = await this.notification.create({
      data: createNotificationDto,
    });
    if (!newNotification)
      throw new BadRequestException('Could not create a new notification.');

    this.webSocketGateway.sendNotification({
      id: newNotification.id,
      conversationId: newNotification.conversationId,
      type: newNotification.type,
      sender: {
        id: sender.id,
        name: sender.name,
      },
      receiverId: newNotification.receiverId,
      createdAt: newNotification.createdAt,
    });
    return newNotification;
  }

  async getNotifications() {
    const notifications = await this.notification.findMany();
    const formattedNotifications = await Promise.all(
      notifications.map(async (notification) => ({
        id: notification.id,
        conversationId: notification.conversationId,
        type: notification.type,
        sender: await this.user
          .findUnique({
            where: { id: notification.senderId },
          })
          .then((user) => ({
            id: user.id,
            name: user.name,
          })),
        receiverId: notification.receiverId,
        createdAt: notification.createdAt,
      })),
    );
    return formattedNotifications;
  }

  async deleteNotification(id: string) {
    console.log('id: ', id);
    const notification = await this.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    console.log('notification: ', notification);
    await this.notification.delete({
      where: { id },
    });
    return 'Notification deleted';
  }
}
