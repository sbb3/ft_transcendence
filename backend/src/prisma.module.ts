import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    imports: [],
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
