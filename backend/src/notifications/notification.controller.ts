import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/createNotificationDto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification.' })
  @UseGuards(JwtGuard)
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications.' })
  @UseGuards(JwtGuard)
  getNotifications() {
    return this.notificationService.getNotifications();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification by id.' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(JwtGuard)
  deleteNotification(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
