import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGateway } from 'src/users/users.gateway';

@Module({
  controllers: [UserController],
  providers: [UserService, UserGateway],
})
export class UserModule {}
