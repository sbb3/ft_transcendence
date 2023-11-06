import {
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Delete,
  BadRequestException,
  Logger,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { userIdDto } from './dto/creatuserDto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaClient } from '@prisma/client';
import { BlockUserDto } from './dto/block-user.dto';

@Controller('users')
export class UsersController extends PrismaClient {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  //for debug
  private readonly logger = new Logger(Controller.name);

  // usersService: any;
  @Get()
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    this.logger.log('\nfind by id\n');
    return this.usersService.findOneById(id);
  }

  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @Get('email/:email')
  async getBlocked(@Param('email') email: string) {
    // this.logger.log('\n parametere email\n');
    return this.usersService.findByEmail(email);
  }

  @Get('currentuser/:id')
  async getCurrentUser(@Param('id') userId: number) {
    return this.usersService.getCurrentUser(userId);
  }

  @Patch(':id/settings')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserDetails(
    @Param('id', ParseIntPipe) userId: number,
    @Body('username') username: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.updateUserDetails(
        userId,
        username,
        avatar,
      );
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/friends')
  async getFriends(@Param('id') id: string) {
    const userId = Number(id);
    return this.usersService.getFriends(userId);
  }

  @Post(':id/friends')
  addFriend(@Param('id') id: string, @Body('friendId') friendId: number) {
    const userId = Number(id);
    return this.usersService.addFriend(userId, friendId);
  }

  @Delete(':id/friends/:friendId')
  deleteFriend(@Param('id') id: number, @Param('friendId') friendId: number) {
    const userId = Number(id);
    const friendIdNumber = Number(friendId);
    return this.usersService.deleteFriend(userId, friendIdNumber);
  }

  @ApiBody({ type: userIdDto })
  @ApiOperation({ summary: "Set 'is_profile_completed' to true." })
  @Post('profile-check-completed')
  @UseGuards(JwtGuard)
  async updateProfileCheck(
    @Body('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ) {
    try {
      const user = await this.usersService.updateUserData(userId);

      return response.status(200).json(user);
    } catch (error) {
      return response.status(404).json(error);
    }
  }
  @ApiOperation({ summary: 'Get leaderboard' })
  @UseGuards(JwtGuard)
  @Get('leaderboard')
  async getLeaderboard() {
    try {
      return await this.usersService.getLeaderboard();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @ApiOperation({ summary: 'Get recent games' })
  @UseGuards(JwtGuard)
  @Get(':userId/recentgames')
  async getRecentGames(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return await this.usersService.getRecentGames(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id/blockuser')
  async blockUser(@Res() response: Response, @Body() blockUserDto: BlockUserDto, @Param("id", ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.blockUser(blockUserDto, id);
      return response.status(200).json(user)
    }
    catch (error) {
      return error.status ? response.status(error.status).json(error) : response.status(500).json(error);
    }
  }


  @UseGuards(JwtGuard)
  @Patch(':id/unblockuser')
  async unblockUser(@Res() response: Response, @Body() blockUserDto: BlockUserDto, @Param("id", ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.unblockUser(blockUserDto, id);
      return response.status(200).json(user)
    }
    catch (error) {
      return error.status ? response.status(error.status).json(error) : response.status(500).json(error);
    }
  }
}