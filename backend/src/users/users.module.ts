

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CloudinaryModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryProvider, CloudinaryService],
})
export class UsersModule {}


// mport { Module } from '@nestjs/common';
// import { CloudinaryProvider } from './cloudinary.provider';
// import { CloudinaryService } from './cloudinary.service';
// import { UserService } from './user.service';
// import { PrismaService } from './prisma.service';

// @Module({
//   providers: [CloudinaryProvider, CloudinaryService, UserService, PrismaService],
// })
// export class UserModule {}