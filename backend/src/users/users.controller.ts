// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post()
//   create(@Body() createUserDto: CreateUserDto) {
//     return this.usersService.create(createUserDto);
//   }

//   @Get()
//   findAll() {
//     return this.usersService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.usersService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     return this.usersService.update(+id, updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.usersService.remove(+id);
//   }
// }

import { Controller, Get, Patch, Param, Query, Post, Delete, UsePipes, ValidationPipe, BadRequestException, Logger, Req, Body, UploadedFiles, Res, UploadedFile,
  UseInterceptors, } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {Request} from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  cloudinaryConfigService: any;
  cloudinaryService: any;
  constructor(private readonly usersService: UsersService) {}

  //for debug
  private readonly logger = new Logger(Controller.name);

  // usersService: any;
  @Get()
  findAll() {
    this.logger.log('\nfind all users\n');    
    return this.usersService.findAllUsers();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('\nfind by id\n');
    return this.usersService.findOneById(id);
  }


  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    this.logger.log('\nusername\n');
    const user = await this.usersService.findByUsername(username);
    return user;
  }
 
    @Get('email/:email')
    async getBlocked(@Param('email') email: string) {
      // this.logger.log('\n parametere email\n');
        return this.usersService.findByEmail(email);
    }







@Patch(':id/settings')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserDetails(
    @Param('id') userId: number,
    @Body('username') username: string,
  //   // @UploadedFile() file: Express.Multer.File,) {
  //   // console.log(`\n username : ${username} \n`);
  //   // console.log(`\n PATH  file : ${file.path} \n`);
  //   // console.log(`\n first file : ${file.originalname} \n`);
  
  //   // await this.usersService.updateUserDetails(userId, username, file);
    
  // }
  @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateUserDetails(userId, username, file);
  }
}
  /**
   *uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadImageToCloudinary(file);
  }
   */
// @Post('upload')
//     return this.cloudinaryService.uploadFile(file);
//   }
// @UseInterceptors(FileInterceptor('file'))
//   uploadImage(@UploadedFile() file: Express.Multer.File) {
//     return this.cloudinaryService.uploadFile(file);
//   }
  // async create(@UploadedFiles() files, @Req() request, @Res() response) {
  //   // Handle file upload here, e.g., store Cloudinary public_ids or local file paths
  //   const cloudinary = this.cloudinaryConfigService.cloudinary;

  //   // Create your product using the uploaded files and other data
  //   const product = await createProduct(request.body, files);

  //   // Return a response to the client
  //   response.status(201).json({ message: 'Product created', product });
  // }

  // @Get(':id/friends')
  // getFriends(@Param('id') id: string) {
  //   // Implement logic to get a user's friends
  // }

  // @Post(':id/friends')
  // addFriend(@Param('id') id: string, @Query('currentUserId') currentUserId: string) {
  //   // Implement logic to add a friend for a user
  // }

  // @Delete(':id/friends/:friendId')
  // deleteFriend(@Param('id') id: string, @Param('friendId') friendId: string) {
  //   // Implement logic to delete a friend
  // }




