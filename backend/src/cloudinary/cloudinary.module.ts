// import { Module } from "@nestjs/common";
// import { CloudinaryProvider } from "./cloudinary.controller";
// import { CloudinaryService } from "./cloudinary.service";
// import { PrismaModule } from "../prismaFolder/prisma.module";

// @Module({
//   providers: [CloudinaryProvider, CloudinaryService],
//   imports: [PrismaModule],
//   exports: [CloudinaryProvider, CloudinaryService],
// })
// export class CloudinaryModule {}

import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}