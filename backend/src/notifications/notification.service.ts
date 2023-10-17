import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNotificationDto } from './dto/createNotificationDto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService extends PrismaClient {
  constructor(private webSocketGateway: NotificationGateway) {
    super();
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notification.create({
      data: createNotificationDto,
    });
    if (!notification) {
      throw new BadRequestException('notification not created');
    }
    return notification;
  }

  async getNotifications() {
    const notifications = await this.notification.findMany();
    return notifications;
  }

  async remove(id: number) {
    const notification = await this.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return this.notification.delete({
      where: { id },
    });
  }
}
